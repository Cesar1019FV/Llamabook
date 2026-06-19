import secrets
from datetime import UTC, datetime, timedelta
from typing import Literal

from passlib.context import CryptContext

from llamabook.config import Settings

_pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(plain: str) -> str:
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_context.verify(plain, hashed)


def create_token(
    subject: str,
    token_type: Literal["access", "refresh"],
    settings: Settings,
    expires_delta: timedelta | None = None,
) -> str:
    from jose import jwt

    if token_type == "access":
        delta = expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    else:
        delta = expires_delta or timedelta(days=settings.refresh_token_expire_days)

    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + delta,
        "jti": secrets.token_hex(16),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str, settings: Settings) -> dict:
    from jose import jwt

    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])


def extract_jti(payload: dict) -> str | None:
    return payload.get("jti")


def extract_exp(payload: dict) -> datetime | None:
    exp = payload.get("exp")
    if exp is None:
        return None
    return datetime.fromtimestamp(exp, tz=UTC)


def generate_refresh_token_value() -> str:
    return secrets.token_urlsafe(32)
