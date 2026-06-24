from __future__ import annotations

from pydantic import BaseModel


class TTSRequest(BaseModel):
    voice: str | None = None
    lang: str = "es"


class TTSVoiceItem(BaseModel):
    id: str
    label: str


class TTSVoicesData(BaseModel):
    es: list[TTSVoiceItem]
    en: list[TTSVoiceItem]


class TTSVoicesResponse(BaseModel):
    voices: TTSVoicesData
