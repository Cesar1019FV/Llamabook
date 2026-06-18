from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.models.notebook import Notebook
from llamabook.repositories.base_repository import BaseRepository


class NotebookRepository(BaseRepository[Notebook]):
    def __init__(self) -> None:
        super().__init__(Notebook)

    async def list_by_user(
        self, db: AsyncSession, user_id: uuid.UUID, *, skip: int = 0, limit: int = 100
    ) -> list[Notebook]:
        statement = (
            select(Notebook)
            .where(Notebook.user_id == user_id)
            .order_by(Notebook.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def get_by_id_and_user(
        self, db: AsyncSession, notebook_id: uuid.UUID, user_id: uuid.UUID
    ) -> Notebook | None:
        statement = select(Notebook).where(
            Notebook.id == notebook_id, Notebook.user_id == user_id
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()
