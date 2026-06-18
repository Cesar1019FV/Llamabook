from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, new_uuid, now_utc


class GeneratedDocument(SQLModel, table=True):
    __tablename__ = "generated_document"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    title: str = Field(max_length=255)
    content: str
    type: str = Field(default="draft", max_length=20)
    chat_id: uuid.UUID | None = Field(default=None, foreign_key="chat.id", sa_type=GUID())
    user_id: uuid.UUID = Field(foreign_key="user.id", sa_type=GUID())
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
