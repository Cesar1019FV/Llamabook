from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, new_uuid, now_utc


class Embedding(SQLModel, table=True):
    __tablename__ = "embedding"

    id: uuid.UUID = Field(default_factory=new_uuid, primary_key=True, sa_type=GUID())
    file_id: uuid.UUID = Field(foreign_key="file.id", sa_type=GUID())
    chunk_index: int
    chunk_text: str
    embedding_model: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=now_utc)
