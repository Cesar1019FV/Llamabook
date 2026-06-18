from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.models.agent import Agent
from llamabook.repositories.base_repository import BaseRepository


class AgentRepository(BaseRepository[Agent]):
    def __init__(self) -> None:
        super().__init__(Agent)

    async def list_by_user(
        self, db: AsyncSession, user_id: uuid.UUID, *, skip: int = 0, limit: int = 100
    ) -> list[Agent]:
        statement = (
            select(Agent)
            .where(Agent.user_id == user_id)
            .order_by(Agent.updated_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(statement)
        return list(result.scalars().all())

    async def get_by_id_and_user(
        self, db: AsyncSession, agent_id: uuid.UUID, user_id: uuid.UUID
    ) -> Agent | None:
        statement = select(Agent).where(Agent.id == agent_id, Agent.user_id == user_id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()
