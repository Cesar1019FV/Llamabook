from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.repositories.output_repository import GeneratedDocumentRepository
from llamabook.schemas.output import (
    GeneratedDocumentCreateRequest,
    GeneratedDocumentResponse,
    GeneratedDocumentUpdateRequest,
)
from llamabook.services.output_service import GeneratedDocumentService

router = APIRouter(prefix="/documents", tags=["documents"])


async def _document_service() -> GeneratedDocumentService:
    return GeneratedDocumentService(GeneratedDocumentRepository())


DocumentServiceDep = Annotated[GeneratedDocumentService, Depends(_document_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


def _serialize_document(doc) -> GeneratedDocumentResponse:
    return GeneratedDocumentResponse(
        id=str(doc.id),
        title=doc.title,
        content=doc.content,
        type=doc.type,
        chat_id=str(doc.chat_id) if doc.chat_id else None,
        created_at=doc.created_at.isoformat(),
        updated_at=doc.updated_at.isoformat(),
    )


@router.post("/", response_model=GeneratedDocumentResponse, status_code=201)
async def create_document(
    body: GeneratedDocumentCreateRequest,
    service: DocumentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    doc = await service.create_document(
        db,
        current_user,
        title=body.title,
        content=body.content,
        type=body.type,
        chat_id=uuid.UUID(body.chat_id) if body.chat_id else None,
    )
    return _serialize_document(doc)


@router.get("/", response_model=list[GeneratedDocumentResponse])
async def list_documents(
    service: DocumentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
    skip: int = 0,
    limit: int = 100,
):
    docs = await service.list_documents(db, current_user.id, skip=skip, limit=limit)
    return [_serialize_document(d) for d in docs]


@router.get("/{document_id}", response_model=GeneratedDocumentResponse)
async def get_document(
    document_id: str,
    service: DocumentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    doc = await service.get_document(db, uuid.UUID(document_id), current_user.id)
    return _serialize_document(doc)


@router.patch("/{document_id}", response_model=GeneratedDocumentResponse)
async def update_document(
    document_id: str,
    body: GeneratedDocumentUpdateRequest,
    service: DocumentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    doc = await service.update_document(
        db,
        uuid.UUID(document_id),
        current_user.id,
        title=body.title,
        content=body.content,
        type=body.type,
    )
    return _serialize_document(doc)


@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: str,
    service: DocumentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    await service.delete_document(db, uuid.UUID(document_id), current_user.id)
    return None
