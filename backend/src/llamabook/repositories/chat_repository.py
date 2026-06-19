from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.models.chat import Chat, Message
from llamabook.repositories.base_repository import BaseRepository


class ChatRepository(BaseRepository[Chat]):
    def __init__(self) -> None:
        super().__init__(Chat)

    async def get_by_id_with_messages(
        self, db: AsyncSession, chat_id: uuid.UUID
    ) -> tuple[Chat | None, list[Message]]:
        chat = await self.get_by_id(db, chat_id)
        if not chat:
            return None, []
        messages = await self._load_messages(db, chat_id)
        return chat, messages

    async def list_by_user(
        self, db: AsyncSession, user_id: uuid.UUID, *, skip: int = 0, limit: int = 100
    ) -> list[Chat]:
        statement = (
            select(Chat)
            .where(Chat.user_id == user_id)
            .order_by(Chat.pinned.desc(), Chat.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def _load_messages(
        self, db: AsyncSession, chat_id: uuid.UUID
    ) -> list[Message]:
        statement = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
        )
        result = await db.execute(statement)
        return list(result.scalars().all())


class MessageRepository(BaseRepository[Message]):
    def __init__(self) -> None:
        super().__init__(Message)
