from __future__ import annotations

from pydantic import BaseModel, Field


class GeneratedDocumentCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)
    type: str = Field(default="draft", max_length=20)
    chat_id: str | None = None


class GeneratedDocumentUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: str | None = Field(default=None, min_length=1)
    type: str | None = Field(default=None, max_length=20)


class GeneratedDocumentResponse(BaseModel):
    id: str
    title: str
    content: str
    type: str
    chat_id: str | None
    created_at: str
    updated_at: str
