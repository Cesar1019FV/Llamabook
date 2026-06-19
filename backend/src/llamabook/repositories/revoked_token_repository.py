from __future__ import annotations

from datetime import datetime

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.models.revoked_token import RevokedToken


class RevokedTokenRepository:
    async def is_revoked(self, db: AsyncSession, jti: str) -> bool:
        statement = select(RevokedToken.jti).where(RevokedToken.jti == jti)
        result = await db.execute(statement)
        return result.scalar_one_or_none() is not None

    async def revoke(
        self,
        db: AsyncSession,
        jti: str,
        user_id: object,
        expires_at: datetime,
    ) -> RevokedToken:
        record = RevokedToken(jti=jti, user_id=user_id, expires_at=expires_at)
        db.add(record)
        await db.flush()
        return record

    async def purge_expired(self, db: AsyncSession, now: datetime) -> int:
        statement = delete(RevokedToken).where(RevokedToken.expires_at < now)
        result = await db.execute(statement)
        return result.rowcount
