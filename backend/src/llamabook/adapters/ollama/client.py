from __future__ import annotations

import ollama
from httpx import Timeout

from llamabook.config import Settings


class OllamaClient:
    def __init__(self, settings: Settings) -> None:
        timeout = Timeout(connect=10.0, read=300.0, write=10.0, pool=10.0)
        self._client = ollama.AsyncClient(
            host=settings.ollama_base_url,
            headers={"Authorization": f"Bearer {settings.ollama_api_key}"} if settings.ollama_api_key else {},
            timeout=timeout,
        )
        self.settings = settings

    async def chat_stream(self, model: str, messages: list[dict], options: dict | None = None):
        stream = await self._client.chat(
            model=model,
            messages=messages,
            stream=True,
            options=options,
        )
        async for chunk in stream:
            yield chunk

    async def embed(self, model: str, input_text: str | list[str]) -> list[float] | list[list[float]]:
        response = await self._client.embeddings(model=model, prompt=input_text if isinstance(input_text, str) else input_text[0])
        return response.embedding

    async def list_models(self) -> list[str]:
        try:
            response = await self._client.list()
            return [m.model for m in response.models]
        except Exception:
            return []
