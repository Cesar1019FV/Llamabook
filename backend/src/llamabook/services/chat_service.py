from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.config import Settings
from llamabook.exceptions import NotFoundError
from llamabook.models.chat import Chat, Message
from llamabook.models.user import User
from llamabook.prompts import TITLE_GENERATION_SYSTEM, TITLE_GENERATION_USER_TEMPLATE
from llamabook.repositories.chat_repository import ChatRepository, MessageRepository

_NEW_CHAT_TITLE = "New chat"


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
        self, db: AsyncSession, chat_id: uuid.UUID, role: str, content: str
    ) -> Message:
        message = Message(chat_id=chat_id, role=role, content=content)
        await self.message_repo.create(db, message)
        return message

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
        return [{"role": m.role, "content": m.content} for m in messages]

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
        self, db: AsyncSession, chat_id: uuid.UUID, user_id: uuid.UUID, content: str
    ):
        chat, existing_messages = await self.get_chat(db, chat_id, user_id)
        is_first_message = len(existing_messages) == 0
        await self.add_message(db, chat.id, "user", content)
        await db.commit()

        messages = await self.chat_repo._load_messages(db, chat.id)
        history = self.build_history(messages)

        assistant_message = Message(chat_id=chat.id, role="assistant", content="")
        await self.message_repo.create(db, assistant_message)

        if is_first_message:
            title = await self._generate_title(content)
            if title:
                chat.title = title
                yield {"type": "title", "title": title}

        buffer = ""
        model_used = chat.model
        try:
            async for chunk in self.ollama.chat_stream(model_used, history):
                delta = chunk.message.content if chunk.message else ""
                buffer += delta
                if delta:
                    yield {"type": "delta", "content": delta, "message_id": str(assistant_message.id)}
        except Exception:
            if model_used == self.settings.ollama_default_model:
                raise
            model_used = self.settings.ollama_default_model
            chat.model = model_used
            buffer = ""
            async for chunk in self.ollama.chat_stream(model_used, history):
                delta = chunk.message.content if chunk.message else ""
                buffer += delta
                if delta:
                    yield {"type": "delta", "content": delta, "message_id": str(assistant_message.id)}

        assistant_message.content = buffer
        chat.updated_at = datetime.now(UTC)
        await db.commit()
        yield {"type": "done", "done": True, "message_id": str(assistant_message.id)}
