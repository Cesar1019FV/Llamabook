from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.types import CHAR, TypeDecorator


class GUID(TypeDecorator):
    """SQLite-native UUID storage as CHAR(32)."""

    impl = CHAR(32)
    cache_ok = True

    def process_bind_param(self, value: uuid.UUID | str | None, dialect) -> str | None:
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value.hex
        return uuid.UUID(value).hex

    def process_result_value(self, value: str | None, dialect) -> uuid.UUID | None:
        if value is None:
            return None
        return uuid.UUID(value)

    @property
    def python_type(self):
        return uuid.UUID


def now_utc() -> datetime:
    return datetime.now(UTC)


def new_uuid() -> uuid.UUID:
    return uuid.uuid4()
