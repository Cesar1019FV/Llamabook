from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.config import Settings, get_settings
from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.repositories.chat_repository import ChatRepository, MessageRepository
from llamabook.schemas.chat import (
    ChatCreateRequest,
    ChatResponse,
    ChatStreamEvent,
    ChatUpdateRequest,
    MessageEditRequest,
    MessageImageRef,
    MessageRequest,
    MessageResponse,
)
from llamabook.services.chat_service import ChatService

router = APIRouter(prefix="/chats", tags=["chats"])


async def _chat_service(settings: Annotated[Settings, Depends(get_settings)]) -> ChatService:
    return ChatService(
        ChatRepository(),
        MessageRepository(),
        OllamaClient(settings),
        settings,
    )


ChatServiceDep = Annotated[ChatService, Depends(_chat_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


def _serialize_chat(chat) -> ChatResponse:
    return ChatResponse(
        id=str(chat.id),
        title=chat.title,
        model=chat.model,
        pinned=bool(chat.pinned),
        created_at=chat.created_at.isoformat(),
        updated_at=chat.updated_at.isoformat(),
    )


def _serialize_message(message) -> MessageResponse:
    web_search_results = None
    if message.web_search_results:
        try:
            import json
            raw = json.loads(message.web_search_results)
            web_search_results = [
                {"title": r.get("title", ""), "url": r.get("url", ""), "content": r.get("content", "")}
                for r in raw
            ]
        except Exception:
            web_search_results = None
    images = None
    if message.image_refs:
        try:
            import json
            refs = json.loads(message.image_refs)
            images = [
                MessageImageRef(file_id=r.get("file_id", ""), name=r.get("name", ""), mime_type=r.get("mime_type", ""))
                for r in refs
            ]
        except Exception:
            images = None
    return MessageResponse(
        id=str(message.id),
        role=message.role,
        content=message.content,
        thinking=message.thinking,
        web_search_results=web_search_results,
        images=images,
        created_at=message.created_at.isoformat(),
    )


@router.post("/", response_model=ChatResponse, status_code=201)
async def create_chat(
    body: ChatCreateRequest,
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    chat = await service.create_chat(
        db,
        current_user,
        title=body.title,
        model=body.model,
        notebook_id=uuid.UUID(body.notebook_id) if body.notebook_id else None,
        agent_id=uuid.UUID(body.agent_id) if body.agent_id else None,
        first_message=body.message,
    )
    return _serialize_chat(chat)


@router.get("/", response_model=list[ChatResponse])
async def list_chats(
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
    skip: int = 0,
    limit: int = 100,
):
    chats = await service.list_user_chats(db, current_user.id, skip=skip, limit=limit)
    return [_serialize_chat(c) for c in chats]


@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(
    chat_id: str,
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    chat, _ = await service.get_chat(db, uuid.UUID(chat_id), current_user.id)
    return _serialize_chat(chat)


@router.patch("/{chat_id}", response_model=ChatResponse)
async def update_chat(
    chat_id: str,
    body: ChatUpdateRequest,
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    chat = await service.update_chat(
        db,
        uuid.UUID(chat_id),
        current_user.id,
        title=body.title,
        pinned=body.pinned,
    )
    return _serialize_chat(chat)


@router.delete("/{chat_id}", status_code=204)
async def delete_chat(
    chat_id: str,
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    await service.delete_chat(db, uuid.UUID(chat_id), current_user.id)
    return None


@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
async def list_messages(
    chat_id: str,
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    _, messages = await service.get_chat(db, uuid.UUID(chat_id), current_user.id)
    return [_serialize_message(m) for m in messages]


@router.post("/{chat_id}/messages")
async def send_message(
    chat_id: str,
    body: MessageRequest,
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    async def event_generator():
        async for event in service.stream_response(
            db, uuid.UUID(chat_id), current_user.id, body.content, tools=body.tools, think=body.think, image_ids=body.image_ids
        ):
            yield f"data: {ChatStreamEvent(**event).model_dump_json()}\n\n"
        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/{chat_id}/messages/{message_id}/edit")
async def edit_message(
    chat_id: str,
    message_id: str,
    body: MessageEditRequest,
    service: ChatServiceDep,
    db: DbDep,
    current_user: CurrentUserDep,
):
    async def event_generator():
        await service.edit_user_message(
            db, uuid.UUID(chat_id), current_user.id, uuid.UUID(message_id), body.new_content
        )
        async for event in service.stream_response(
            db,
            uuid.UUID(chat_id),
            current_user.id,
            body.new_content,
            tools=body.tools,
            think=body.think,
            skip_user_insert=True,
        ):
            yield f"data: {ChatStreamEvent(**event).model_dump_json()}\n\n"
        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
