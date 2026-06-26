from __future__ import annotations

from pydantic import BaseModel, Field


class ChatCreateRequest(BaseModel):
    title: str | None = None
    notebook_id: str | None = None
    agent_id: str | None = None
    model: str | None = None
    message: str | None = None


class ChatUpdateRequest(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    pinned: bool | None = None


class ChatResponse(BaseModel):
    id: str
    title: str | None
    model: str
    pinned: bool
    created_at: str
    updated_at: str


class MessageRequest(BaseModel):
    content: str = Field(min_length=1)
    tools: list[str] | None = None
    think: bool | str | None = None
    image_ids: list[str] | None = None


class MessageEditRequest(BaseModel):
    new_content: str = Field(min_length=1)
    tools: list[str] | None = None
    think: bool | str | None = None
    image_ids: list[str] | None = None


class WebSearchResultItem(BaseModel):
    title: str
    url: str
    content: str


class MessageImageRef(BaseModel):
    file_id: str
    name: str
    mime_type: str


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    thinking: str | None = None
    web_search_results: list[WebSearchResultItem] | None = None
    images: list[MessageImageRef] | None = None
    created_at: str


class ChatStreamEvent(BaseModel):
    type: str
    content: str | None = None
    thinking: str | None = None
    message_id: str | None = None
    title: str | None = None
    web_search_results: list[WebSearchResultItem] | None = None
    web_search_query: str | None = None
    done: bool = False
