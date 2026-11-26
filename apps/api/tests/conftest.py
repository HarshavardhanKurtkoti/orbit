import sys
import asyncio
from pathlib import Path
import pytest

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    except Exception:
        pass


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Ensure database schema is created and demo data is seeded for the test session."""
    from app.seed import seed_data
    from app.core.database import engine

    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(seed_data())
        loop.run_until_complete(engine.dispose())
    except Exception as exc:
        print(f"[conftest] Database initialization note: {exc}")
    finally:
        loop.close()


@pytest.fixture(autouse=True)
async def reset_db_pool_per_test():
    """Reset engine pool before and after each async test to prevent cross-loop connection reuse."""
    from app.core.database import engine
    await engine.dispose()
    yield
    await engine.dispose()

