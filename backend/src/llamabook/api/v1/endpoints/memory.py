from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.config import Settings, get_settings
from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.schemas.auth import UserResponse
from llamabook.services.memory_service import MemoryService

router = APIRouter(prefix="/memory", tags=["memory"])


class MemoryExtractRequest(BaseModel):
    messages: list[str] = Field(min_length=1)
    model: str | None = None


class MemoryExtractResponse(BaseModel):
    tags: list[str]
    user: UserResponse


async def _memory_service(settings: Annotated[Settings, Depends(get_settings)]) -> MemoryService:
    return MemoryService(OllamaClient(settings), settings)


MemoryServiceDep = Annotated[MemoryService, Depends(_memory_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


def _user_to_response(user) -> UserResponse:
    import json

    from llamabook.schemas.auth import UserPreferences

    prefs = None
    if user.preferences:
        try:
            prefs = UserPreferences.model_validate(json.loads(user.preferences))
        except Exception:
            prefs = None
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        role=user.role,
        is_active=user.is_active,
        preferences=prefs,
    )


@router.post("/extract", response_model=MemoryExtractResponse)
async def extract_memory(
    body: MemoryExtractRequest,
    current_user: CurrentUserDep,
    db: DbDep,
    service: MemoryServiceDep,
    settings: Annotated[Settings, Depends(get_settings)],
):
    import logging

    logger = logging.getLogger(__name__)
    logger.info(
        "Memory extract request: user=%s model=%s messages=%d",
        current_user.id,
        body.model,
        len(body.messages),
    )

    requested_model = body.model or settings.ollama_default_model
    existing_tags = []
    if current_user.preferences and current_user.preferences.memory:
        existing_tags = current_user.preferences.memory.tags

    tags = await service.extract(requested_model, body.messages, existing_tags)
    if not tags and requested_model != settings.ollama_default_model:
        tags = await service.extract(settings.ollama_default_model, body.messages, existing_tags)

    logger.info("Memory extract tags before save: user=%s tags=%s", current_user.id, tags)
    await service.save_tags(db, current_user, tags)
    logger.info("Memory extract response: user=%s tags=%s", current_user.id, tags)

    return MemoryExtractResponse(tags=tags, user=_user_to_response(current_user))
