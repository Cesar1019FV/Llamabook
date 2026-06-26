from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    secret_key: str = Field(min_length=32, alias="LLAMABOOK_SECRET_KEY")
    admin_email: str = Field(default="admin@llamabook.local", alias="LLAMABOOK_ADMIN_EMAIL")
    admin_password: str = Field(default="admin", alias="LLAMABOOK_ADMIN_PASSWORD")

    host: str = Field(default="127.0.0.1", alias="LLAMABOOK_HOST")
    port: int = Field(default=8000, alias="LLAMABOOK_PORT")
    reload: bool = Field(default=True, alias="LLAMABOOK_RELOAD")

    cors_origins: list[str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173"],
        alias="LLAMABOOK_CORS_ORIGINS",
    )

    data_dir: Path = Field(default=Path("backend/data"), alias="LLAMABOOK_DATA_DIR")
    max_upload_size: int = Field(default=50 * 1024 * 1024, alias="LLAMABOOK_MAX_UPLOAD_SIZE")
    memory_max_context_tags: int = Field(default=50, alias="LLAMABOOK_MEMORY_MAX_CONTEXT_TAGS")

    ollama_base_url: str = Field(default="http://localhost:11434", alias="OLLAMA_BASE_URL")
    ollama_api_key: str | None = Field(default=None, alias="OLLAMA_API_KEY")
    ollama_default_model: str = Field(default="llama3.2", alias="OLLAMA_DEFAULT_MODEL")
    ollama_embed_model: str = Field(default="nomic-embed-text", alias="OLLAMA_EMBED_MODEL")

    access_token_expire_minutes: int = Field(default=15, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    @field_validator("data_dir", mode="before")
    @classmethod
    def _resolve_data_dir(cls, value: str | Path) -> Path:
        path = Path(value)
        if not path.is_absolute():
            path = _PROJECT_ROOT / path
        return path.expanduser().resolve()

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.strip("[]").split(",") if origin.strip()]
        return value

    @property
    def database_url(self) -> str:
        db_path = self.data_dir / "llamabook.db"
        abs_path = str(db_path).replace("\\", "/")
        return f"sqlite+aiosqlite:///{abs_path}"

    @property
    def files_dir(self) -> Path:
        return self.data_dir / "files"

    @property
    def algorithm(self) -> Literal["HS256"]:
        return "HS256"


@lru_cache
def get_settings() -> Settings:
    return Settings()
