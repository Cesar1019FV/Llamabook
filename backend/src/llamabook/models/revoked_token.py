from __future__ import annotations

import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel

from llamabook.models.base import GUID, now_utc


class RevokedToken(SQLModel, table=True):
    __tablename__ = "revoked_token"

    jti: str = Field(primary_key=True, max_length=64)
    user_id: uuid.UUID = Field(foreign_key="user.id", sa_type=GUID())
    expires_at: datetime
    created_at: datetime = Field(default_factory=now_utc)
