from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.models.output import GeneratedDocument
from llamabook.repositories.base_repository import BaseRepository


class GeneratedDocumentRepository(BaseRepository[GeneratedDocument]):
    def __init__(self) -> None:
        super().__init__(GeneratedDocument)

    async def list_by_user(
        self, db: AsyncSession, user_id: uuid.UUID, *, skip: int = 0, limit: int = 100
    ) -> list[GeneratedDocument]:
        statement = (
            select(GeneratedDocument)
            .where(GeneratedDocument.user_id == user_id)
            .order_by(GeneratedDocument.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def get_by_id_and_user(
        self, db: AsyncSession, doc_id: uuid.UUID, user_id: uuid.UUID
    ) -> GeneratedDocument | None:
        statement = select(GeneratedDocument).where(
            GeneratedDocument.id == doc_id, GeneratedDocument.user_id == user_id
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()
