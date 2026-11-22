import asyncio
import logging
from contextlib import asynccontextmanager
from urllib.parse import urlparse
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine
from app.core.redis import close_redis, get_redis
from app.models.base import Base
from app.api.v1.router import api_router

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe logging of target database host
    try:
        parsed_db = urlparse(settings.async_database_url)
        host_info = f"{parsed_db.hostname}:{parsed_db.port or 5432}"
        logger.info(f"[Orbit] Connecting to database at {host_info}...")
    except Exception:
        pass

    # Initialize DB tables on startup with retry loop to handle database startup race conditions
    max_retries = 15
    retry_delay = 2.0
    for attempt in range(1, max_retries + 1):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("[Orbit] Database schema initialized successfully.")
            break
        except (ConnectionRefusedError, OSError, Exception) as e:
            if attempt == max_retries:
                logger.error(
                    f"[Orbit] Failed to connect to database after {max_retries} attempts: {e}"
                )
                raise e
            logger.warning(
                f"[Orbit] Database not ready yet ({type(e).__name__}: {e}). Retrying in {retry_delay}s ({attempt}/{max_retries})..."
            )
            await asyncio.sleep(retry_delay)

    yield
    # Cleanup on shutdown
    await close_redis()
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", status_code=status.HTTP_200_OK)
@app.get("/healthz", status_code=status.HTTP_200_OK)
async def health_check():
    """Primary health check endpoint for Render, Kubernetes, and uptime monitoring."""
    checks = {
        "database": "unknown",
        "redis": "unknown",
        "llm_provider": settings.LLM_PROVIDER,
        "llm_configured": bool(settings.OPENROUTER_API_KEY or settings.OPENAI_API_KEY),
    }

    # Verify PostgreSQL connectivity
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        checks["database"] = "connected"
    except Exception as e:
        checks["database"] = f"unhealthy: {str(e)[:80]}"

    # Verify Redis connectivity
    try:
        r = await get_redis()
        pong = await r.ping()
        checks["redis"] = "connected" if pong else "disconnected"
    except Exception as e:
        checks["redis"] = f"unhealthy: {str(e)[:80]}"

    is_healthy = checks["database"] == "connected"
    return {
        "status": "healthy" if is_healthy else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "checks": checks,
    }


@app.get("/health/live", status_code=status.HTTP_200_OK)
async def health_live():
    """Liveness probe: verifies the API process is alive."""
    return {"status": "live", "version": settings.VERSION}


@app.get("/health/ready", status_code=status.HTTP_200_OK)
async def health_ready():
    """Readiness probe: verifies the service is ready to accept traffic."""
    return await health_check()


@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "tagline": "Your mind. Your universe. One workspace.",
        "docs": "/docs",
    }
