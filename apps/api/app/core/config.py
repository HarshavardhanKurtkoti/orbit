from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "ORBIT API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://orbit_user:orbit_password@localhost:5432/orbit_db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "orbit-secret-development-key-change-in-production-389f4h89gh34"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]
    
    # AI Config
    OPENAI_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None
    OPENROUTER_MODEL: str = "nvidia/nemotron-3-ultra-550b-a55b:free"
    LLM_PROVIDER: str = "openrouter"
    AI_DEMO_MODE: bool = False

    @property
    def effective_openrouter_model(self) -> str:
        if self.OPENROUTER_MODEL == "nvidia/nemotron-3-ultra:free":
            return "nvidia/nemotron-3-ultra-550b-a55b:free"
        return self.OPENROUTER_MODEL

    @property
    def async_database_url(self) -> str:
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=(".env", "../../.env", "../.env"),
        extra="ignore",
    )



settings = Settings()
