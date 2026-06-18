from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.models.embedding import Embedding
from llamabook.repositories.base_repository import BaseRepository


class EmbeddingRepository(BaseRepository[Embedding]):
    def __init__(self) -> None:
        super().__init__(Embedding)

    async def list_by_file(self, db: AsyncSession, file_id: uuid.UUID) -> list[Embedding]:
        statement = select(Embedding).where(Embedding.file_id == file_id)
        result = await db.execute(statement)
        return list(result.scalars().all())
