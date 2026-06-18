from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.exceptions import NotFoundError
from llamabook.models.chat import Chat, Message
from llamabook.models.user import User
from llamabook.repositories.chat_repository import ChatRepository, MessageRepository


class ChatService:
    def __init__(
        self,
        chat_repo: ChatRepository,
        message_repo: MessageRepository,
        ollama: OllamaClient,
    ) -> None:
        self.chat_repo = chat_repo
        self.message_repo = message_repo
        self.ollama = ollama

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
            title=title or (first_message[:60] if first_message else "New chat"),
            user_id=user.id,
            notebook_id=notebook_id,
            agent_id=agent_id,
            model=model or "llama3.2",
        )
        await self.chat_repo.create(db, chat)

        if first_message:
            await self.add_message(db, chat.id, "user", first_message)

        return chat

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

    async def get_chat(self, db: AsyncSession, chat_id: uuid.UUID, user_id: uuid.UUID) -> Chat:
        chat = await self.chat_repo.get_by_id_with_messages(db, chat_id)
        if not chat or chat.user_id != user_id:
            raise NotFoundError("Chat not found")
        return chat

    def build_history(self, messages: list[Message]) -> list[dict]:
        return [{"role": m.role, "content": m.content} for m in messages]

    async def stream_response(
        self, db: AsyncSession, chat_id: uuid.UUID, user_id: uuid.UUID, content: str
    ):
        chat = await self.get_chat(db, chat_id, user_id)
        await self.add_message(db, chat.id, "user", content)
        await db.commit()

        chat.messages = await self.chat_repo._load_messages(db, chat.id)
        history = self.build_history(chat.messages)

        assistant_message = Message(chat_id=chat.id, role="assistant", content="")
        await self.message_repo.create(db, assistant_message)

        buffer = ""
        async for chunk in self.ollama.chat_stream(chat.model, history):
            delta = chunk.message.content if chunk.message else ""
            buffer += delta
            yield {"type": "delta", "content": delta}

        assistant_message.content = buffer
        chat.updated_at = datetime.now(UTC)
        await db.commit()
        yield {"type": "done", "done": True}
