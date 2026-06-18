from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, new_uuid, now_utc


class File(SQLModel, table=True):
    __tablename__ = "file"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    name: str = Field(max_length=255)
    mime_type: str = Field(max_length=255)
    size: int
    storage_path: str
    extracted_text_path: str | None = Field(default=None)
    user_id: uuid.UUID = Field(foreign_key="user.id", sa_type=GUID())
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class FileNotebookLink(SQLModel, table=True):
    __tablename__ = "file_notebook_link"

    file_id: uuid.UUID = Field(foreign_key="file.id", primary_key=True, sa_type=GUID())
    notebook_id: uuid.UUID = Field(foreign_key="notebook.id", primary_key=True, sa_type=GUID())


class FileChatLink(SQLModel, table=True):
    __tablename__ = "file_chat_link"

    file_id: uuid.UUID = Field(foreign_key="file.id", primary_key=True, sa_type=GUID())
    chat_id: uuid.UUID = Field(foreign_key="chat.id", primary_key=True, sa_type=GUID())
