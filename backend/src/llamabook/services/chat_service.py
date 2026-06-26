from __future__ import annotations

import json
import uuid
from datetime import UTC, datetime

import ollama
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.config import Settings
from llamabook.exceptions import NotFoundError
from llamabook.models.chat import Chat, Message
from llamabook.models.user import User
from llamabook.prompts import TITLE_GENERATION_SYSTEM, TITLE_GENERATION_USER_TEMPLATE
from llamabook.repositories.chat_repository import ChatRepository, MessageRepository

_NEW_CHAT_TITLE = "New chat"
_MAX_TOOL_ROUNDS = 5
_WEB_SEARCH_TOOL = ollama.web_search
_WEB_FETCH_TOOL = ollama.web_fetch


class ChatService:
    def __init__(
        self,
        chat_repo: ChatRepository,
        message_repo: MessageRepository,
        ollama: OllamaClient,
        settings: Settings,
    ) -> None:
        self.chat_repo = chat_repo
        self.message_repo = message_repo
        self.ollama = ollama
        self.settings = settings

    async def create_chat(
        self,
        db: AsyncSession,
        user: User,
        title: str | None,
        model: str | None,
        notebook_id: uuid.UUID | None,
        agent_id: uuid.UUID | None,
        first_message: str | None,
    ) -> Chat:
        chat = Chat(
            title=title or _NEW_CHAT_TITLE,
            user_id=user.id,
            notebook_id=notebook_id,
            agent_id=agent_id,
            model=model or self.settings.ollama_default_model,
        )
        await self.chat_repo.create(db, chat)

        if first_message:
            await self.add_message(db, chat.id, "user", first_message)

        return chat

    async def update_chat(
        self,
        db: AsyncSession,
        chat_id: uuid.UUID,
        user_id: uuid.UUID,
        title: str | None = None,
        pinned: bool | None = None,
    ) -> Chat:
        chat, _ = await self.get_chat(db, chat_id, user_id)
        if title is not None:
            chat.title = title[:255]
        if pinned is not None:
            chat.pinned = pinned
        chat.updated_at = datetime.now(UTC)
        await db.commit()
        await db.refresh(chat)
        return chat

    async def delete_chat(self, db: AsyncSession, chat_id: uuid.UUID, user_id: uuid.UUID) -> None:
        chat, _ = await self.get_chat(db, chat_id, user_id)
        await self.chat_repo.delete(db, chat)
        await db.commit()

    async def add_message(
        self,
        db: AsyncSession,
        chat_id: uuid.UUID,
        role: str,
        content: str,
        image_refs: list[dict] | None = None,
    ) -> Message:
        message = Message(
            chat_id=chat_id,
            role=role,
            content=content,
            image_refs=json.dumps(image_refs) if image_refs else None,
        )
        await self.message_repo.create(db, message)
        return message

    async def edit_user_message(
        self,
        db: AsyncSession,
        chat_id: uuid.UUID,
        user_id: uuid.UUID,
        message_id: uuid.UUID,
        new_content: str,
    ) -> None:
        chat, messages = await self.get_chat(db, chat_id, user_id)
        message = next((m for m in messages if m.id == message_id), None)
        if not message or message.role != "user":
            raise NotFoundError("Message not found")
        message.content = new_content.strip()
        await self.message_repo.save(db, message)
        await self.chat_repo.delete_messages_after(db, chat_id, message_id)
        chat.updated_at = datetime.now(UTC)
        await db.commit()

    async def list_user_chats(
        self, db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[Chat]:
        return await self.chat_repo.list_by_user(db, user_id, skip=skip, limit=limit)

    async def get_chat(
        self, db: AsyncSession, chat_id: uuid.UUID, user_id: uuid.UUID
    ) -> tuple[Chat, list[Message]]:
        chat, messages = await self.chat_repo.get_by_id_with_messages(db, chat_id)
        if not chat or chat.user_id != user_id:
            raise NotFoundError("Chat not found")
        return chat, messages

    def build_history(self, messages: list[Message]) -> list[dict]:
        history: list[dict] = []
        for m in messages:
            entry: dict = {"role": m.role, "content": m.content}
            if m.thinking:
                entry["thinking"] = m.thinking
            if m.image_refs:
                try:
                    refs = json.loads(m.image_refs)
                    images_b64 = self._load_image_base64(refs)
                    if images_b64:
                        entry["images"] = images_b64
                except Exception:
                    pass
            history.append(entry)
        return history

    def _load_image_base64(self, refs: list[dict]) -> list[str]:
        import base64

        from llamabook.config import get_settings

        settings = get_settings()
        result: list[str] = []
        for ref in refs:
            file_id = ref.get("file_id")
            name = ref.get("name", "image")
            if not file_id:
                continue
            storage_path = settings.files_dir / file_id / name
            if storage_path.exists():
                result.append(base64.b64encode(storage_path.read_bytes()).decode("utf-8"))
        return result

    async def _generate_title(self, first_message: str) -> str | None:
        try:
            content = await self.ollama.chat_complete(
                self.settings.ollama_default_model,
                [
                    {"role": "system", "content": TITLE_GENERATION_SYSTEM},
                    {"role": "user", "content": TITLE_GENERATION_USER_TEMPLATE.format(message=first_message)},
                ],
                options={"temperature": 0.2},
            )
            cleaned = content.strip().strip('"').strip("'").strip(".")
            if cleaned:
                return cleaned[:255]
        except Exception:
            pass
        return None

    async def stream_response(
        self,
        db: AsyncSession,
        chat_id: uuid.UUID,
        user_id: uuid.UUID,
        content: str,
        tools: list[str] | None = None,
        think: bool | str | None = None,
        skip_user_insert: bool = False,
        image_ids: list[str] | None = None,
    ):
        chat, existing_messages = await self.get_chat(db, chat_id, user_id)
        is_first_message = len(existing_messages) == 0

        image_refs: list[dict] | None = None
        if image_ids:
            from llamabook.repositories.file_repository import FileRepository

            file_repo = FileRepository()
            resolved: list[dict] = []
            for fid_str in image_ids:
                try:
                    fid = uuid.UUID(fid_str)
                except ValueError:
                    continue
                fr = await file_repo.get_by_id_and_user(db, fid, user_id)
                if fr:
                    resolved.append({
                        "file_id": str(fr.id),
                        "name": fr.name,
                        "mime_type": fr.mime_type,
                    })
            if resolved:
                image_refs = resolved

        if not skip_user_insert:
            user_message = await self.add_message(db, chat.id, "user", content, image_refs=image_refs)
            await db.commit()
            yield {"type": "user_message", "message_id": str(user_message.id)}

        messages = await self.chat_repo._load_messages(db, chat.id)
        history = self.build_history(messages)

        assistant_message = Message(chat_id=chat.id, role="assistant", content="")
        await self.message_repo.create(db, assistant_message)

        if is_first_message:
            title = await self._generate_title(content)
            if title:
                chat.title = title
                yield {"type": "title", "title": title}

        use_web_search = bool(tools and "web_search" in tools)

        if think is None:
            think_param: bool | str | None = True
        elif think is False:
            think_param = False
        elif think is True:
            think_param = True
        else:
            think_param = think

        all_search_results: list[dict] = []

        if use_web_search:
            async for event in self._stream_with_web_search(
                chat.model, history, think_param, assistant_message, all_search_results
            ):
                yield event
        else:
            async for event in self._stream_simple(
                chat.model, history, think_param, assistant_message
            ):
                yield event

        if all_search_results:
            assistant_message.web_search_results = json.dumps(all_search_results)

        assistant_message.thinking = getattr(assistant_message, "_thinking_buffer", None)
        chat.updated_at = datetime.now(UTC)
        await db.commit()
        yield {"type": "done", "done": True, "message_id": str(assistant_message.id)}

    async def _stream_simple(
        self,
        model: str,
        history: list[dict],
        think: bool | None,
        assistant_message: Message,
    ):
        content_buffer = ""
        thinking_buffer = ""

        async for chunk in self.ollama.chat_stream(model, history, think=think):
            if not chunk.message:
                continue
            if chunk.message.thinking:
                thinking_buffer += chunk.message.thinking
                yield {"type": "thinking", "thinking": chunk.message.thinking, "message_id": str(assistant_message.id)}
            if chunk.message.content:
                content_buffer += chunk.message.content
                yield {"type": "delta", "content": chunk.message.content, "message_id": str(assistant_message.id)}

        assistant_message.content = content_buffer
        assistant_message._thinking_buffer = thinking_buffer or None

    async def _stream_with_web_search(
        self,
        model: str,
        history: list[dict],
        think: bool | None,
        assistant_message: Message,
        all_search_results: list[dict],
    ):
        agentic_messages = list(history)
        tool_specs = [_WEB_SEARCH_TOOL, _WEB_FETCH_TOOL]

        for _ in range(_MAX_TOOL_ROUNDS):
            response = await self.ollama.chat_with_tools(
                model, agentic_messages, tool_specs, think=think
            )

            if response.message.thinking:
                yield {
                    "type": "thinking",
                    "thinking": response.message.thinking,
                    "message_id": str(assistant_message.id),
                }

            if response.message.content:
                yield {
                    "type": "delta",
                    "content": response.message.content,
                    "message_id": str(assistant_message.id),
                }
                assistant_message.content += response.message.content

            agentic_messages.append({
                "role": response.message.role,
                "content": response.message.content or "",
            })

            tool_calls = getattr(response.message, "tool_calls", None)
            if not tool_calls:
                break

            for tc in tool_calls:
                func_name = tc.function.name
                func_args = tc.function.arguments

                if func_name == "web_search":
                    query = func_args.get("query", "")
                    yield {"type": "web_search", "web_search_query": query, "message_id": str(assistant_message.id)}
                    try:
                        results = await self.ollama.web_search(query, max_results=8)
                        all_search_results.extend(results)
                        yield {
                            "type": "web_search_results",
                            "web_search_results": results,
                            "message_id": str(assistant_message.id),
                        }
                        tool_content = json.dumps(results)[:8000]
                    except Exception as exc:
                        tool_content = f"Web search failed: {exc}"
                    agentic_messages.append({
                        "role": "tool",
                        "content": tool_content,
                        "tool_name": func_name,
                    })
                elif func_name == "web_fetch":
                    url = func_args.get("url", "")
                    try:
                        result = await self.ollama.web_fetch(url)
                        tool_content = result.get("content", "")[:8000]
                    except Exception as exc:
                        tool_content = f"Web fetch failed: {exc}"
                    agentic_messages.append({
                        "role": "tool",
                        "content": tool_content,
                        "tool_name": func_name,
                    })
                else:
                    agentic_messages.append({
                        "role": "tool",
                        "content": f"Tool {func_name} not found",
                        "tool_name": func_name,
                    })

        final_content = ""
        thinking_buffer = ""
        async for chunk in self.ollama.chat_stream(
            model, agentic_messages, think=think
        ):
            if not chunk.message:
                continue
            if chunk.message.thinking:
                thinking_buffer += chunk.message.thinking
                yield {"type": "thinking", "thinking": chunk.message.thinking, "message_id": str(assistant_message.id)}
            if chunk.message.content:
                final_content += chunk.message.content
                yield {"type": "delta", "content": chunk.message.content, "message_id": str(assistant_message.id)}

        if final_content:
            assistant_message.content = final_content
        if thinking_buffer:
            assistant_message._thinking_buffer = thinking_buffer
