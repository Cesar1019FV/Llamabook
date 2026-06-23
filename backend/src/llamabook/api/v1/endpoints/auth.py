from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.config import Settings, get_settings
from llamabook.core.security import extract_exp, extract_jti
from llamabook.database import get_db
from llamabook.dependencies import (
    CurrentUserDep,
    get_revoked_token_repository,
    get_user_repository,
    oauth2_scheme,
)
from llamabook.repositories.revoked_token_repository import RevokedTokenRepository
from llamabook.schemas.auth import (
    RefreshRequest,
    TokenResponse,
    UserCreateRequest,
    UserResponse,
    UserUpdateRequest,
)
from llamabook.services.auth_service import AuthService, UserService

router = APIRouter(prefix="/auth", tags=["auth"])


async def _auth_service() -> AuthService:
    return AuthService(get_user_repository())


async def _user_service() -> UserService:
    return UserService(get_user_repository())


AuthServiceDep = Annotated[AuthService, Depends(_auth_service)]
UserServiceDep = Annotated[UserService, Depends(_user_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]
SettingsDep = Annotated[Settings, Depends(get_settings)]
RevokedTokenRepoDep = Annotated[RevokedTokenRepository, Depends(get_revoked_token_repository)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: AuthServiceDep,
    db: DbDep,
    settings: SettingsDep,
):
    _, access_token, refresh_token = await service.authenticate(
        db, credentials.username, credentials.password, settings
    )
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    body: RefreshRequest,
    service: AuthServiceDep,
    db: DbDep,
    settings: SettingsDep,
):
    _, access_token, refresh_token = await service.refresh(db, body.refresh_token, settings)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(
    body: UserCreateRequest,
    service: UserServiceDep,
    db: DbDep,
):
    user = await service.register(db, body)
    return UserResponse(
        id=str(user.id), email=user.email, name=user.name, role=user.role, is_active=user.is_active
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: CurrentUserDep):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        is_active=current_user.is_active,
    )


@router.patch("/me", response_model=UserResponse)
async def update_me(
    body: UserUpdateRequest,
    current_user: CurrentUserDep,
    service: UserServiceDep,
    db: DbDep,
):
    user = await service.update_user(db, current_user.id, body)
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        role=user.role,
        is_active=user.is_active,
    )


@router.post("/logout", status_code=204)
async def logout(
    current_user: CurrentUserDep,
    token: TokenDep,
    db: DbDep,
    settings: SettingsDep,
    revoked_repo: RevokedTokenRepoDep,
) -> None:
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    jti = extract_jti(payload)
    if not jti:
        return None
    expires_at = extract_exp(payload)
    if expires_at is None:
        return None
    await revoked_repo.revoke(db, jti, current_user.id, expires_at)
    await db.commit()
    return None
