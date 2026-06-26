from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from llamabook.config import Settings, get_settings

router = APIRouter(prefix="/models", tags=["models"])


class DefaultModelResponse(BaseModel):
    id: str


SettingsDep = Annotated[Settings, Depends(get_settings)]


@router.get("/default", response_model=DefaultModelResponse)
async def get_default_model(settings: SettingsDep):
    return DefaultModelResponse(id=settings.ollama_default_model)
