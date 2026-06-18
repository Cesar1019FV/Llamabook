from __future__ import annotations

from pydantic import BaseModel, Field


class ChatCreateRequest(BaseModel):
    title: str | None = None
    notebook_id: str | None = None
    agent_id: str | None = None
    model: str | None = None
    message: str | None = None


class ChatResponse(BaseModel):
    id: str
    title: str | None
    model: str
    created_at: str
    updated_at: str


class MessageRequest(BaseModel):
    content: str = Field(min_length=1)


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str


class ChatStreamEvent(BaseModel):
    type: str
    content: str | None = None
    message_id: str | None = None
    done: bool = False
