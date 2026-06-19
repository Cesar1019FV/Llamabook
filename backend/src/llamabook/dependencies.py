from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.config import Settings, get_settings
from llamabook.core.security import extract_jti
from llamabook.database import get_db
from llamabook.exceptions import UnauthorizedError
from llamabook.models.user import User
from llamabook.repositories.revoked_token_repository import RevokedTokenRepository
from llamabook.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

SettingsDep = Annotated[Settings, Depends(get_settings)]


def get_user_repository() -> UserRepository:
    return UserRepository()


UserRepoDep = Annotated[UserRepository, Depends(get_user_repository)]


def get_revoked_token_repository() -> RevokedTokenRepository:
    return RevokedTokenRepository()


RevokedTokenRepoDep = Annotated[RevokedTokenRepository, Depends(get_revoked_token_repository)]

DbDep = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    token: Annotated[str | None, Depends(oauth2_scheme)],
    settings: SettingsDep,
    db: DbDep,
    repo: UserRepoDep,
    revoked_repo: RevokedTokenRepoDep,
) -> User:
    if not token:
        raise UnauthorizedError("Missing authentication token")

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        sub = payload.get("sub")
        if not sub:
            raise UnauthorizedError("Invalid token payload")
    except JWTError as exc:
        raise UnauthorizedError("Could not validate credentials") from exc

    jti = extract_jti(payload)
    if jti and await revoked_repo.is_revoked(db, jti):
        raise UnauthorizedError("Token has been revoked")

    user = await repo.get_by_id(db, sub)
    if not user or not user.is_active:
        raise UnauthorizedError("User not found or inactive")

    return user


CurrentUserDep = Annotated[User, Depends(get_current_user)]


def require_admin(current_user: CurrentUserDep) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required",
        )
    return current_user


AdminDep = Annotated[User, Depends(require_admin)]
