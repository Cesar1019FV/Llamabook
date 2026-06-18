from __future__ import annotations

from pydantic import BaseModel, Field


class NotebookCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    context: str | None = None
    color: str | None = Field(default=None, max_length=20)


class NotebookUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    context: str | None = None
    color: str | None = Field(default=None, max_length=20)


class NotebookResponse(BaseModel):
    id: str
    name: str
    context: str | None
    color: str | None
    created_at: str
    updated_at: str
