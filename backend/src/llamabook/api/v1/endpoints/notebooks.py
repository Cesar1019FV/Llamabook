from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.repositories.notebook_repository import NotebookRepository
from llamabook.schemas.notebook import (
    NotebookCreateRequest,
    NotebookResponse,
    NotebookUpdateRequest,
)
from llamabook.services.notebook_service import NotebookService

router = APIRouter(prefix="/notebooks", tags=["notebooks"])


async def _notebook_service() -> NotebookService:
    return NotebookService(NotebookRepository())


NotebookServiceDep = Annotated[NotebookService, Depends(_notebook_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


def _serialize_notebook(notebook) -> NotebookResponse:
    return NotebookResponse(
        id=str(notebook.id),
        name=notebook.name,
        context=notebook.context,
        color=notebook.color,
        created_at=notebook.created_at.isoformat(),
        updated_at=notebook.updated_at.isoformat(),
    )


@router.post("/", response_model=NotebookResponse, status_code=201)
async def create_notebook(
    body: NotebookCreateRequest,
    service: NotebookServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    notebook = await service.create_notebook(
        db, current_user, name=body.name, context=body.context, color=body.color
    )
    return _serialize_notebook(notebook)


@router.get("/", response_model=list[NotebookResponse])
async def list_notebooks(
    service: NotebookServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
    skip: int = 0,
    limit: int = 100,
):
    notebooks = await service.list_notebooks(db, current_user.id, skip=skip, limit=limit)
    return [_serialize_notebook(n) for n in notebooks]


@router.get("/{notebook_id}", response_model=NotebookResponse)
async def get_notebook(
    notebook_id: str,
    service: NotebookServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    notebook = await service.get_notebook(db, uuid.UUID(notebook_id), current_user.id)
    return _serialize_notebook(notebook)


@router.patch("/{notebook_id}", response_model=NotebookResponse)
async def update_notebook(
    notebook_id: str,
    body: NotebookUpdateRequest,
    service: NotebookServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    notebook = await service.update_notebook(
        db,
        uuid.UUID(notebook_id),
        current_user.id,
        name=body.name,
        context=body.context,
        color=body.color,
    )
    return _serialize_notebook(notebook)


@router.delete("/{notebook_id}", status_code=204)
async def delete_notebook(
    notebook_id: str,
    service: NotebookServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    await service.delete_notebook(db, uuid.UUID(notebook_id), current_user.id)
    return None
