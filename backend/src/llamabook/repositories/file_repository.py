from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.models.file import File
from llamabook.repositories.base_repository import BaseRepository


class FileRepository(BaseRepository[File]):
    def __init__(self) -> None:
        super().__init__(File)

    async def list_by_user(
        self, db: AsyncSession, user_id: uuid.UUID, *, skip: int = 0, limit: int = 100
    ) -> list[File]:
        statement = (
            select(File)
            .where(File.user_id == user_id)
            .order_by(File.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def get_by_id_and_user(
        self, db: AsyncSession, file_id: uuid.UUID, user_id: uuid.UUID
    ) -> File | None:
        statement = select(File).where(File.id == file_id, File.user_id == user_id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()
