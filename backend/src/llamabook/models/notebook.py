from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, new_uuid, now_utc


class Notebook(SQLModel, table=True):
    __tablename__ = "notebook"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    name: str = Field(max_length=255)
    context: str | None = Field(default=None)
    color: str | None = Field(default=None, max_length=20)
    user_id: uuid.UUID = Field(foreign_key="user.id", sa_type=GUID())
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
