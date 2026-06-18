from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from llamabook.database import get_db
from llamabook.dependencies import AdminDep
from llamabook.repositories.user_repository import UserRepository
from llamabook.schemas.auth import UserCreateRequest, UserResponse
from llamabook.services.auth_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


async def _user_service() -> UserService:
    return UserService(UserRepository())


UserServiceDep = Annotated[UserService, Depends(_user_service)]
DbDep = Annotated[AsyncSession, Depends(get_db)]


@router.get("/", response_model=list[UserResponse])
async def list_users(
    service: UserServiceDep,
    db: DbDep,
    _: AdminDep,
    skip: int = 0,
    limit: int = 100,
):
    users = await service.list_users(db, skip=skip, limit=limit)
    return [
        UserResponse(
            id=str(u.id), email=u.email, name=u.name, role=u.role, is_active=u.is_active
        )
        for u in users
    ]


@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    body: UserCreateRequest,
    service: UserServiceDep,
    db: DbDep,
    _: AdminDep,
):
    user = await service.register(db, body)
    return UserResponse(
        id=str(user.id), email=user.email, name=user.name, role=user.role, is_active=user.is_active
    )
