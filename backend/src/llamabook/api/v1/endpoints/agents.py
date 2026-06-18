from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.repositories.agent_repository import AgentRepository
from llamabook.schemas.agent import (
    AgentCreateRequest,
    AgentResponse,
    AgentUpdateRequest,
)
from llamabook.services.agent_service import AgentService

router = APIRouter(prefix="/agents", tags=["agents"])


async def _agent_service() -> AgentService:
    return AgentService(AgentRepository())


AgentServiceDep = Annotated[AgentService, Depends(_agent_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


def _serialize_agent(agent) -> AgentResponse:
    return AgentResponse(
        id=str(agent.id),
        name=agent.name,
        description=agent.description,
        system_prompt=agent.system_prompt,
        avatar=agent.avatar,
        color=agent.color,
        model=agent.model,
        is_public=agent.is_public,
        created_at=agent.created_at.isoformat(),
        updated_at=agent.updated_at.isoformat(),
    )


@router.post("/", response_model=AgentResponse, status_code=201)
async def create_agent(
    body: AgentCreateRequest,
    service: AgentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    agent = await service.create_agent(
        db,
        current_user,
        name=body.name,
        description=body.description,
        system_prompt=body.system_prompt,
        avatar=body.avatar,
        color=body.color,
        model=body.model,
        is_public=body.is_public,
    )
    return _serialize_agent(agent)


@router.get("/", response_model=list[AgentResponse])
async def list_agents(
    service: AgentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
    skip: int = 0,
    limit: int = 100,
):
    agents = await service.list_agents(db, current_user.id, skip=skip, limit=limit)
    return [_serialize_agent(a) for a in agents]


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    service: AgentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    agent = await service.get_agent(db, uuid.UUID(agent_id), current_user.id)
    return _serialize_agent(agent)


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    body: AgentUpdateRequest,
    service: AgentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    agent = await service.update_agent(
        db,
        uuid.UUID(agent_id),
        current_user.id,
        name=body.name,
        description=body.description,
        system_prompt=body.system_prompt,
        avatar=body.avatar,
        color=body.color,
        model=body.model,
        is_public=body.is_public,
    )
    return _serialize_agent(agent)


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(
    agent_id: str,
    service: AgentServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    await service.delete_agent(db, uuid.UUID(agent_id), current_user.id)
    return None
