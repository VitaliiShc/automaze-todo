from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./app.db"
    cors_origins: list[str] = ["http://localhost:3000"]

    google_client_id: str
    jwt_secret: str
    jwt_expires_minutes: int = 10080


@lru_cache
def get_settings() -> Settings:
    # Required fields (google_client_id, jwt_secret) have no default because they are
    # secrets that must be explicitly set; pydantic-settings populates them from .env
    # at runtime, which mypy cannot see from this zero-argument call site.
    return Settings()  # type: ignore[call-arg]


settings = get_settings()
