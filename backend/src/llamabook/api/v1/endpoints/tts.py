from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.database import get_db
from llamabook.dependencies import CurrentUserDep
from llamabook.exceptions import NotFoundError
from llamabook.repositories.chat_repository import ChatRepository
from llamabook.schemas.tts import TTSRequest, TTSVoicesData, TTSVoicesResponse
from llamabook.services.tts_service import (
    TTS_VOICES,
    clean_text_for_tts,
    generate_audio,
    get_default_voice,
)

router = APIRouter(prefix="/tts", tags=["tts"])

ChatRepoDep = Annotated[ChatRepository, Depends(ChatRepository)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


@router.get("/voices", response_model=TTSVoicesResponse)
async def list_voices() -> TTSVoicesResponse:
    data = TTSVoicesData(es=TTS_VOICES["es"], en=TTS_VOICES["en"])
    return TTSVoicesResponse(voices=data)


@router.post("/chats/{chat_id}/messages/{message_id}/speak")
async def speak_message(
    chat_id: str,
    message_id: str,
    body: TTSRequest,
    db: DbDep,
    current_user: CurrentUserDep,
    chat_repo: ChatRepoDep,
) -> StreamingResponse:
    chat, messages = await chat_repo.get_by_id_with_messages(db, uuid.UUID(chat_id))
    if not chat or chat.user_id != current_user.id:
        raise NotFoundError("Chat not found")

    message = next((m for m in messages if str(m.id) == message_id), None)
    if not message:
        raise NotFoundError("Message not found")
    if message.role != "assistant":
        raise HTTPException(status_code=400, detail="TTS only available for assistant messages")

    text = clean_text_for_tts(message.content)
    if not text:
        raise HTTPException(status_code=400, detail="No text to speak")

    voice = body.voice or get_default_voice(body.lang)

    try:
        audio_bytes = await generate_audio(text, voice)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="TTS service unavailable. Try a different voice.",
        ) from None

    async def audio_iterator():
        yield audio_bytes

    return StreamingResponse(
        audio_iterator(),
        media_type="audio/mpeg",
        headers={
            "Cache-Control": "no-cache",
            "X-TTS-Voice": voice,
        },
    )
