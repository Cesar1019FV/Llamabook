from __future__ import annotations

import json
import logging
from datetime import UTC, datetime

from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.adapters.ollama.client import OllamaClient
from llamabook.config import Settings
from llamabook.models.user import User
from llamabook.prompts import MEMORY_EXTRACTION_SYSTEM, MEMORY_EXTRACTION_USER_TEMPLATE
from llamabook.repositories.user_repository import UserRepository
from llamabook.schemas.auth import MemoryData, UserPreferences

logger = logging.getLogger(__name__)

_MAX_FACTS = 10
_MAX_FACT_LENGTH = 140


class MemoryExtractionResult(BaseModel):
    facts: list[str] = Field(default_factory=list, max_length=_MAX_FACTS)


class MemoryService:
    def __init__(self, ollama: OllamaClient, settings: Settings) -> None:
        self.ollama = ollama
        self.settings = settings
        self.repo = UserRepository()

    def _parse_preferences(self, user: User) -> UserPreferences:
        if not user.preferences:
            return UserPreferences()
        try:
            return UserPreferences.model_validate(json.loads(user.preferences))
        except Exception:
            return UserPreferences()

    def _serialize_preferences(self, prefs: UserPreferences) -> str:
        return prefs.model_dump_json()

    async def extract(self, model: str, messages: list[str], existing_tags: list[str]) -> list[str]:
        logger.info("Memory extraction called: model=%s, messages=%d existing=%d", model, len(messages), len(existing_tags))
        new_tags = await self._extract_facts(model, messages, existing_tags)
        logger.info("Memory extraction returning tags=%s count=%d", new_tags, len(new_tags))
        return new_tags

    async def save_tags(self, db: AsyncSession, user: User, new_tags: list[str]) -> list[str]:
        logger.info("Memory save_tags called: user=%s tags=%s", user.id, new_tags)
        if not new_tags:
            return []

        prefs = self._parse_preferences(user)
        memory = prefs.memory or MemoryData()
        existing = set(memory.tags)
        for tag in new_tags:
            existing.add(tag)
        memory.tags = list(existing)
        memory.last_extracted_at = datetime.now(UTC).isoformat()
        prefs.memory = memory
        user.preferences = self._serialize_preferences(prefs)
        logger.info("Memory serialized preferences: %s", user.preferences)
        await self.repo.save(db, user)
        await db.commit()
        logger.info("Memory saved: user=%s total_tags=%d", user.id, len(memory.tags))

        return new_tags

    async def _extract_facts(self, model: str, messages: list[str], existing_tags: list[str]) -> list[str]:
        joined = "\n\n---\n\n".join(messages)
        context_tags = existing_tags[-self.settings.memory_max_context_tags:]
        existing_block = "\n".join(f"- {tag}" for tag in context_tags) if context_tags else "None"
        prompt = MEMORY_EXTRACTION_USER_TEMPLATE.format(
            messages=joined,
            existing_tags=existing_block,
            max_length=_MAX_FACT_LENGTH,
        )

        try:
            raw = await self.ollama.generate(
                model=model,
                prompt=prompt,
                system=MEMORY_EXTRACTION_SYSTEM.format(max_length=_MAX_FACT_LENGTH),
                format=MemoryExtractionResult.model_json_schema(),
                options={"temperature": 0.2},
            )
        except Exception as exc:
            logger.error("Ollama generate failed: %s", exc, exc_info=True)
            return []

        logger.info("Ollama raw response length: %d", len(raw) if raw else 0)
        logger.info("Ollama raw response preview: %s", (raw[:500] if raw else "EMPTY"))

        cleaned_raw = self._strip_json_fences(raw)
        logger.info("Cleaned response preview: %s", (cleaned_raw[:500] if cleaned_raw else "EMPTY"))

        try:
            result = MemoryExtractionResult.model_validate_json(cleaned_raw)
        except Exception as exc:
            logger.error("JSON validation failed: %s", exc, exc_info=True)
            return []

        facts: list[str] = []
        seen: set[str] = set()
        for fact in result.facts:
            cleaned = fact.strip()
            if not cleaned or len(cleaned) > _MAX_FACT_LENGTH:
                continue
            key = cleaned.lower()
            if key in seen:
                continue
            seen.add(key)
            facts.append(cleaned)

        logger.info("Extracted %d facts after filtering: %s", len(facts), facts)
        return facts

    def _strip_json_fences(self, raw: str) -> str:
        if not raw:
            return raw
        text = raw.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if len(lines) >= 2:
                lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            text = text[start : end + 1]
        return text

    async def remove_tag(self, db: AsyncSession, user: User, tag: str) -> User:
        prefs = self._parse_preferences(user)
        if prefs.memory:
            prefs.memory.tags = [t for t in prefs.memory.tags if t != tag]
            user.preferences = self._serialize_preferences(prefs)
            await self.repo.save(db, user)
            await db.commit()
        return user
