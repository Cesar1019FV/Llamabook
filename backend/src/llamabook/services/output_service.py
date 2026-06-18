from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.exceptions import NotFoundError
from llamabook.models.output import GeneratedDocument
from llamabook.models.user import User
from llamabook.repositories.output_repository import GeneratedDocumentRepository


class GeneratedDocumentService:
    def __init__(self, repo: GeneratedDocumentRepository) -> None:
        self.repo = repo

    async def create_document(
        self,
        db: AsyncSession,
        user: User,
        title: str,
        content: str,
        type: str,
        chat_id: uuid.UUID | None,
    ) -> GeneratedDocument:
        doc = GeneratedDocument(
            title=title, content=content, type=type, chat_id=chat_id, user_id=user.id
        )
        return await self.repo.create(db, doc)

    async def list_documents(
        self, db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[GeneratedDocument]:
        return await self.repo.list_by_user(db, user_id, skip=skip, limit=limit)

    async def get_document(
        self, db: AsyncSession, doc_id: uuid.UUID, user_id: uuid.UUID
    ) -> GeneratedDocument:
        doc = await self.repo.get_by_id_and_user(db, doc_id, user_id)
        if not doc:
            raise NotFoundError("Document not found")
        return doc

    async def update_document(
        self,
        db: AsyncSession,
        doc_id: uuid.UUID,
        user_id: uuid.UUID,
        title: str | None,
        content: str | None,
        type: str | None,
    ) -> GeneratedDocument:
        doc = await self.get_document(db, doc_id, user_id)
        if title is not None:
            doc.title = title
        if content is not None:
            doc.content = content
        if type is not None:
            doc.type = type
        doc.updated_at = datetime.now(UTC)
        return await self.repo.save(db, doc)

    async def delete_document(
        self, db: AsyncSession, doc_id: uuid.UUID, user_id: uuid.UUID
    ) -> None:
        doc = await self.get_document(db, doc_id, user_id)
        await self.repo.delete(db, doc)
