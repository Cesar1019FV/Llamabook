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

    async def chat_stream(
        self,
        model: str,
        messages: list[dict],
        options: dict | None = None,
        think: bool | str | None = None,
        tools: list | None = None,
    ):
        kwargs: dict = {
            "model": model,
            "messages": messages,
            "stream": True,
            "options": options,
        }
        if think is not None:
            kwargs["think"] = think
        if tools is not None:
            kwargs["tools"] = tools
        stream = await self._client.chat(**kwargs)
        async for chunk in stream:
            yield chunk

    async def chat_complete(
        self,
        model: str,
        messages: list[dict],
        options: dict | None = None,
        think: bool | str | None = None,
    ) -> str:
        kwargs: dict = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": options,
        }
        if think is not None:
            kwargs["think"] = think
        response = await self._client.chat(**kwargs)
        return response.message.content if response.message else ""

    async def chat_with_tools(
        self,
        model: str,
        messages: list[dict],
        tools: list,
        think: bool | str | None = None,
        options: dict | None = None,
    ):
        kwargs: dict = {
            "model": model,
            "messages": messages,
            "tools": tools,
            "stream": False,
            "options": options,
        }
        if think is not None:
            kwargs["think"] = think
        return await self._client.chat(**kwargs)

    async def web_search(self, query: str, max_results: int = 5) -> list[dict]:
        response = await self._client.web_search(query, max_results=max_results)
        return [
            {"title": r.title or "", "url": r.url or "", "content": r.content or ""}
            for r in response.results
        ]

    async def web_fetch(self, url: str) -> dict:
        response = await self._client.web_fetch(url)
        return {
            "title": response.title or "",
            "content": response.content or "",
            "links": list(response.links or []),
        }

    async def embed(self, model: str, input_text: str | list[str]) -> list[float] | list[list[float]]:
        response = await self._client.embeddings(model=model, prompt=input_text if isinstance(input_text, str) else input_text[0])
        return response.embedding

    async def list_models(self) -> list[str]:
        try:
            response = await self._client.list()
            return [m.model for m in response.models]
        except Exception:
            return []
