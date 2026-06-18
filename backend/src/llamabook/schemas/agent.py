from __future__ import annotations

from pydantic import BaseModel, Field


class AgentCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    system_prompt: str | None = None
    avatar: str | None = Field(default=None, max_length=255)
    color: str | None = Field(default=None, max_length=20)
    model: str | None = Field(default=None, max_length=100)
    is_public: bool = False


class AgentUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    system_prompt: str | None = None
    avatar: str | None = Field(default=None, max_length=255)
    color: str | None = Field(default=None, max_length=20)
    model: str | None = Field(default=None, max_length=100)
    is_public: bool | None = None


class AgentResponse(BaseModel):
    id: str
    name: str
    description: str | None
    system_prompt: str | None
    avatar: str | None
    color: str | None
    model: str | None
    is_public: bool
    created_at: str
    updated_at: str
