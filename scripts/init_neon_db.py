import asyncio
import sys
import os

# Add apps/api to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "api"))

from app.core.database import engine
from app.models.base import Base
import app.models  # registers all models with Base.metadata
from sqlalchemy import text

async def init_tables():
    print(f"Connecting to database: {engine.url.render_as_string(hide_password=True)}")
    async with engine.begin() as conn:
        print("Creating tables in Neon database...")
        await conn.run_sync(Base.metadata.create_all)
        print("All tables successfully initialized!")

    async with engine.connect() as conn:
        query = text(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = 'public' ORDER BY table_name"
        )
        res = await conn.execute(query)
        tables = [row[0] for row in res.fetchall()]
        print(f"Verified tables in public schema ({len(tables)} tables):")
        for t in tables:
            print(f"  - {t}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_tables())
