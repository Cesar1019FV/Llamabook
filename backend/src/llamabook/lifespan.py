from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlmodel import select

from llamabook.config import Settings, get_settings
from llamabook.core.security import hash_password
from llamabook.database import _get_engine, create_all_tables
from llamabook.models.base import now_utc
from llamabook.models.user import User
from llamabook.repositories.revoked_token_repository import RevokedTokenRepository


async def _seed_admin(settings: Settings) -> None:
    engine = _get_engine()
    async_session_local = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session_local() as session:
        result = await session.execute(select(User).where(User.email == settings.admin_email))
        if not result.scalar_one_or_none():
            session.add(User(
                email=settings.admin_email,
                hashed_password=hash_password(settings.admin_password),
                name="Admin",
                role="admin",
                is_active=True,
            ))
            await session.commit()


async def _purge_expired_tokens() -> None:
    engine = _get_engine()
    async_session_local = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    repo = RevokedTokenRepository()

    async with async_session_local() as session:
        await repo.purge_expired(session, now_utc())
        await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    settings.files_dir.mkdir(parents=True, exist_ok=True)

    await create_all_tables()
    await _purge_expired_tokens()
    await _seed_admin(settings)

    yield
