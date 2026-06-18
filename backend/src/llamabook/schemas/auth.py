from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None
    role: str
    is_active: bool


class UserCreateRequest(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None


class UserUpdateRequest(BaseModel):
    name: str | None = None
    is_active: bool | None = None
