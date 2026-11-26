from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import settings

connect_args = {
    "command_timeout": 15,
    "server_settings": {
        "application_name": "orbit_api",
    },
}
# Neon connection pooling (PgBouncer) best practice: disable statement caching for asyncpg
if "-pooler" in settings.async_database_url:
    connect_args["statement_cache_size"] = 0

engine = create_async_engine(
    settings.async_database_url,
    echo=False,
    future=True,
    pool_pre_ping=False,
    pool_size=20,
    max_overflow=20,
    pool_recycle=300,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
