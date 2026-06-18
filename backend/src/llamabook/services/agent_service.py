from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.exceptions import NotFoundError
from llamabook.models.agent import Agent
from llamabook.models.user import User
from llamabook.repositories.agent_repository import AgentRepository


class AgentService:
    def __init__(self, repo: AgentRepository) -> None:
        self.repo = repo

    async def create_agent(
        self,
        db: AsyncSession,
        user: User,
        name: str,
        description: str | None,
        system_prompt: str | None,
        avatar: str | None,
        color: str | None,
        model: str | None,
        is_public: bool,
    ) -> Agent:
        agent = Agent(
            name=name,
            description=description,
            system_prompt=system_prompt,
            avatar=avatar,
            color=color,
            model=model,
            is_public=is_public,
            user_id=user.id,
        )
        return await self.repo.create(db, agent)

    async def list_agents(
        self, db: AsyncSession, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[Agent]:
        return await self.repo.list_by_user(db, user_id, skip=skip, limit=limit)

    async def get_agent(
        self, db: AsyncSession, agent_id: uuid.UUID, user_id: uuid.UUID
    ) -> Agent:
        agent = await self.repo.get_by_id_and_user(db, agent_id, user_id)
        if not agent:
            raise NotFoundError("Agent not found")
        return agent

    async def update_agent(
        self,
        db: AsyncSession,
        agent_id: uuid.UUID,
        user_id: uuid.UUID,
        name: str | None,
        description: str | None,
        system_prompt: str | None,
        avatar: str | None,
        color: str | None,
        model: str | None,
        is_public: bool | None,
    ) -> Agent:
        agent = await self.get_agent(db, agent_id, user_id)
        if name is not None:
            agent.name = name
        if description is not None:
            agent.description = description
        if system_prompt is not None:
            agent.system_prompt = system_prompt
        if avatar is not None:
            agent.avatar = avatar
        if color is not None:
            agent.color = color
        if model is not None:
            agent.model = model
        if is_public is not None:
            agent.is_public = is_public
        agent.updated_at = datetime.now(UTC)
        return await self.repo.save(db, agent)

    async def delete_agent(
        self, db: AsyncSession, agent_id: uuid.UUID, user_id: uuid.UUID
    ) -> None:
        agent = await self.get_agent(db, agent_id, user_id)
        await self.repo.delete(db, agent)
