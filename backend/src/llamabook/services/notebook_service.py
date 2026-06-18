from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.exceptions import NotFoundError
from llamabook.models.notebook import Notebook
from llamabook.models.user import User
from llamabook.repositories.notebook_repository import NotebookRepository


class NotebookService:
    def __init__(self, repo: NotebookRepository) -> None:
        self.repo = repo

    async def create_notebook(
        self, db: AsyncSession, user: User, name: str, context: str | None, color: str | None
    ) -> Notebook:
        notebook = Notebook(name=name, context=context, color=color, user_id=user.id)
        return await self.repo.create(db, notebook)

    async def list_notebooks(
        self, db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[Notebook]:
        return await self.repo.list_by_user(db, user_id, skip=skip, limit=limit)

    async def get_notebook(
        self, db: AsyncSession, notebook_id: uuid.UUID, user_id: uuid.UUID
    ) -> Notebook:
        notebook = await self.repo.get_by_id_and_user(db, notebook_id, user_id)
        if not notebook:
            raise NotFoundError("Notebook not found")
        return notebook

    async def update_notebook(
        self,
        db: AsyncSession,
        notebook_id: uuid.UUID,
        user_id: uuid.UUID,
        name: str | None,
        context: str | None,
        color: str | None,
    ) -> Notebook:
        notebook = await self.get_notebook(db, notebook_id, user_id)
        if name is not None:
            notebook.name = name
        if context is not None:
            notebook.context = context
        if color is not None:
            notebook.color = color
        notebook.updated_at = datetime.now(UTC)
        return await self.repo.save(db, notebook)

    async def delete_notebook(
        self, db: AsyncSession, notebook_id: uuid.UUID, user_id: uuid.UUID
    ) -> None:
        notebook = await self.get_notebook(db, notebook_id, user_id)
        await self.repo.delete(db, notebook)
