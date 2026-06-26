from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.core.security import (
    create_token,
    hash_password,
    verify_password,
)
from llamabook.exceptions import ConflictError, UnauthorizedError
from llamabook.models.user import User
from llamabook.repositories.user_repository import UserRepository
from llamabook.schemas.auth import UserCreateRequest, UserPreferences, UserUpdateRequest


class AuthService:
    def __init__(self, repo: UserRepository) -> None:
        self.repo = repo

    async def authenticate(
        self, db: AsyncSession, email: str, password: str, settings
    ) -> tuple[User, str, str]:
        user = await self.repo.get_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedError("Invalid credentials")
        if not user.is_active:
            raise UnauthorizedError("User is inactive")

        access_token = create_token(str(user.id), "access", settings)
        refresh_token = create_token(str(user.id), "refresh", settings)
        return user, access_token, refresh_token

    async def refresh(self, db: AsyncSession, refresh_token: str, settings) -> tuple[User, str, str]:
        from llamabook.core.security import decode_token

        try:
            payload = decode_token(refresh_token, settings)
        except Exception as exc:
            raise UnauthorizedError("Invalid refresh token") from exc

        if payload.get("type") != "refresh":
            raise UnauthorizedError("Invalid token type")

        sub = payload.get("sub")
        if not sub:
            raise UnauthorizedError("Invalid token payload")

        user = await self.repo.get_by_id(db, uuid.UUID(sub))
        if not user or not user.is_active:
            raise UnauthorizedError("User not found or inactive")

        access_token = create_token(str(user.id), "access", settings)
        new_refresh_token = create_token(str(user.id), "refresh", settings)
        return user, access_token, new_refresh_token


class UserService:
    def __init__(self, repo: UserRepository) -> None:
        self.repo = repo

    def _load_preferences(self, user: User) -> UserPreferences:
        if not user.preferences:
            return UserPreferences()
        try:
            return UserPreferences.model_validate_json(user.preferences)
        except Exception:
            return UserPreferences()

    async def register(
        self, db: AsyncSession, data: UserCreateRequest
    ) -> User:
        existing = await self.repo.get_by_email(db, data.email)
        if existing:
            raise ConflictError("Email already registered")

        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            name=data.name,
            role="user",
            is_active=True,
        )
        await self.repo.create(db, user)
        return user

    async def list_users(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> list[User]:
        return await self.repo.list_all(db, skip=skip, limit=limit)

    async def update_user(
        self, db: AsyncSession, user_id: uuid.UUID, data: UserUpdateRequest
    ) -> User | None:
        user = await self.repo.get_by_id(db, user_id)
        if not user:
            return None

        if data.name is not None:
            user.name = data.name
        if data.is_active is not None:
            user.is_active = data.is_active
        if data.preferences is not None:
            current = self._load_preferences(user)
            if data.preferences.triggers is not None:
                current.triggers = data.preferences.triggers
            if data.preferences.memory is not None:
                current.memory = data.preferences.memory
            user.preferences = current.model_dump_json()
        user.updated_at = datetime.utcnow()

        await self.repo.save(db, user)
        return user

    async def delete_user(self, db: AsyncSession, user_id: uuid.UUID) -> bool:
        user = await self.repo.get_by_id(db, user_id)
        if not user:
            return False
        await self.repo.delete(db, user)
        return True
