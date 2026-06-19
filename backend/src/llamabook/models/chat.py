from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, new_uuid, now_utc


class Chat(SQLModel, table=True):
    __tablename__ = "chat"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    title: str | None = Field(default=None, max_length=255)
    user_id: uuid.UUID = Field(foreign_key="user.id", sa_type=GUID())
    notebook_id: uuid.UUID | None = Field(default=None, foreign_key="notebook.id", sa_type=GUID())
    agent_id: uuid.UUID | None = Field(default=None, foreign_key="agent.id", sa_type=GUID())
    model: str = Field(default="llama3.2", max_length=100)
    pinned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)


class Message(SQLModel, table=True):
    __tablename__ = "message"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    chat_id: uuid.UUID = Field(foreign_key="chat.id", sa_type=GUID())
    role: str = Field(default="user", max_length=20)
    content: str
    thinking: str | None = Field(default=None)
    web_search_results: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=now_utc)
