from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, new_uuid, now_utc


class Agent(SQLModel, table=True):
    __tablename__ = "agent"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    system_prompt: str | None = Field(default=None)
    avatar: str | None = Field(default=None, max_length=255)
    color: str | None = Field(default=None, max_length=20)
    model: str | None = Field(default=None, max_length=100)
    user_id: uuid.UUID = Field(foreign_key="user.id", sa_type=GUID())
    is_public: bool = Field(default=False)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
