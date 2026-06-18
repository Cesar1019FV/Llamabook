from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile
from fastapi import File as FastAPIFile
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.config import Settings, get_settings
from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.repositories.file_repository import FileRepository
from llamabook.schemas.file import FileContentResponse, FileUploadResponse
from llamabook.services.file_service import FileService

router = APIRouter(prefix="/files", tags=["files"])


async def _file_service(
    settings: Annotated[Settings, Depends(get_settings)]
) -> FileService:
    return FileService(FileRepository(), settings)


FileServiceDep = Annotated[FileService, Depends(_file_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


@router.post("/", response_model=FileUploadResponse, status_code=201)
async def upload_file(
    upload: Annotated[UploadFile, FastAPIFile(...)],
    service: FileServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    file_record = await service.store_file(db, current_user, upload)
    return FileUploadResponse(
        id=str(file_record.id),
        name=file_record.name,
        mime_type=file_record.mime_type,
        size=file_record.size,
        created_at=file_record.created_at.isoformat(),
    )


@router.get("/", response_model=list[FileUploadResponse])
async def list_files(
    service: FileServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
    skip: int = 0,
    limit: int = 100,
):
    files = await service.repo.list_by_user(db, current_user.id, skip=skip, limit=limit)
    return [
        FileUploadResponse(
            id=str(f.id),
            name=f.name,
            mime_type=f.mime_type,
            size=f.size,
            created_at=f.created_at.isoformat(),
        )
        for f in files
    ]


@router.get("/{file_id}", response_model=FileUploadResponse)
async def get_file(
    file_id: str,
    service: FileServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    file_record = await service.repo.get_by_id_and_user(
        db, uuid.UUID(file_id), current_user.id
    )
    if not file_record:
        from llamabook.exceptions import NotFoundError
        raise NotFoundError("File not found")
    return FileUploadResponse(
        id=str(file_record.id),
        name=file_record.name,
        mime_type=file_record.mime_type,
        size=file_record.size,
        created_at=file_record.created_at.isoformat(),
    )


@router.get("/{file_id}/content", response_model=FileContentResponse)
async def get_file_content(
    file_id: str,
    service: FileServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    content = await service.get_file_content(db, uuid.UUID(file_id), current_user.id)
    if content is None:
        from llamabook.exceptions import NotFoundError
        raise NotFoundError("File not found or content not readable")
    return FileContentResponse(id=file_id, content=content)


@router.delete("/{file_id}", status_code=204)
async def delete_file(
    file_id: str,
    service: FileServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    deleted = await service.delete_file(db, uuid.UUID(file_id), current_user.id)
    if not deleted:
        from llamabook.exceptions import NotFoundError
        raise NotFoundError("File not found")
    return None
