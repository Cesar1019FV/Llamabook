from __future__ import annotations

from pydantic import BaseModel


class FileUploadResponse(BaseModel):
    id: str
    name: str
    mime_type: str
    size: int
    created_at: str


class FileContentResponse(BaseModel):
    id: str
    content: str | None
