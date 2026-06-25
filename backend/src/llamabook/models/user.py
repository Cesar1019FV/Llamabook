from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, new_uuid, now_utc


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    email: str = Field(index=True, unique=True, max_length=255)
    hashed_password: str
    name: str | None = Field(default=None, max_length=255)
    role: str = Field(default="user", max_length=20)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    preferences: str | None = Field(default=None)

    @property
    def is_admin(self) -> bool:
        return self.role == "admin"
