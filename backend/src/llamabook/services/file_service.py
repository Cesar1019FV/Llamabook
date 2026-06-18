from __future__ import annotations

import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.file_storage.validators import is_mime_allowed, safe_filename
from llamabook.config import Settings
from llamabook.exceptions import ForbiddenError, ValidationError
from llamabook.models.file import File
from llamabook.models.user import User
from llamabook.repositories.file_repository import FileRepository


class FileService:
    def __init__(self, repo: FileRepository, settings: Settings) -> None:
        self.repo = repo
        self.settings = settings
        self.files_dir = settings.files_dir
        self.files_dir.mkdir(parents=True, exist_ok=True)

    def _file_dir(self, file_id: uuid.UUID) -> Path:
        return self.files_dir / str(file_id)

    async def store_file(self, db: AsyncSession, user: User, upload: UploadFile) -> File:
        if not upload.filename:
            raise ValidationError("Missing filename")

        if upload.size and upload.size > self.settings.max_upload_size:
            raise ValidationError("File too large")

        mime_type = upload.content_type or "application/octet-stream"
        if not is_mime_allowed(mime_type, upload.filename):
            raise ForbiddenError("File type not allowed")

        file_id = uuid.uuid4()
        file_dir = self._file_dir(file_id)
        file_dir.mkdir(parents=True, exist_ok=True)

        safe_name = safe_filename(upload.filename)
        storage_path = file_dir / safe_name

        with open(storage_path, "wb") as buffer:
            shutil.copyfileobj(upload.file, buffer)

        file_record = File(
            id=file_id,
            name=upload.filename,
            mime_type=mime_type,
            size=storage_path.stat().st_size,
            storage_path=str(storage_path.relative_to(self.settings.data_dir)),
            user_id=user.id,
        )
        await self.repo.create(db, file_record)
        return file_record

    async def get_file_content(self, db: AsyncSession, file_id: uuid.UUID, user_id: uuid.UUID) -> str | None:
        file_record = await self.repo.get_by_id_and_user(db, file_id, user_id)
        if not file_record:
            return None

        storage_path = self.settings.data_dir / file_record.storage_path
        if not storage_path.exists():
            return None

        if not file_record.mime_type.startswith("text/"):
            return None

        return storage_path.read_text(encoding="utf-8", errors="replace")

    async def delete_file(self, db: AsyncSession, file_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        file_record = await self.repo.get_by_id_and_user(db, file_id, user_id)
        if not file_record:
            return False

        storage_path = self.settings.data_dir / file_record.storage_path
        file_dir = storage_path.parent
        await self.repo.delete(db, file_record)

        if file_dir.exists():
            shutil.rmtree(file_dir)
        return True
