from __future__ import annotations

import uuid
from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import SQLModel

ModelT = TypeVar("ModelT", bound=SQLModel)


class BaseRepository(Generic[ModelT]):
    def __init__(self, model: type[ModelT]) -> None:
        self.model = model

    async def get_by_id(self, db: AsyncSession, id: uuid.UUID) -> ModelT | None:
        return await db.get(self.model, id)

    async def list_all(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> list[ModelT]:
        statement = select(self.model).offset(skip).limit(limit)
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, obj: ModelT) -> ModelT:
        db.add(obj)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def delete(self, db: AsyncSession, obj: ModelT) -> None:
        await db.delete(obj)
        await db.flush()

    async def save(self, db: AsyncSession, obj: ModelT) -> ModelT:
        await db.flush()
        await db.refresh(obj)
        return obj
