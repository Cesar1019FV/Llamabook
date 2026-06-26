
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TriggerSettings(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    enabled: bool = True
    webSearch: list[str] = Field(default_factory=list, alias="webSearch")  # noqa: N815
    thinking: list[str] = Field(default_factory=list)


class MemoryData(BaseModel):
    tags: list[str] = Field(default_factory=list)
    messages_since_memory: int = 0
    last_extracted_at: str | None = None


class UserPreferences(BaseModel):
    triggers: TriggerSettings | None = None
    memory: MemoryData | None = None


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
    preferences: UserPreferences | None = None


class UserCreateRequest(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None


class UserUpdateRequest(BaseModel):
    name: str | None = None
    is_active: bool | None = None
    preferences: UserPreferences | None = None
