import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "api"))

import httpx
from app.main import app  # type: ignore[missing-import]

async def main():
    print("Testing FastAPI app with Neon PostgreSQL...")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        # Test health endpoint
        res = await client.get("/health")
        print("GET /health status:", res.status_code)
        data = res.json()
        print("GET /health response:", data)
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        assert data.get("checks", {}).get("database") == "connected", "Database is not connected!"
        print(">> FastAPI + Neon PostgreSQL connection: VERIFIED (connected)!")

        # Test Prometheus metrics endpoint
        mres = await client.get("/metrics")
        print("GET /metrics status:", mres.status_code)
        assert mres.status_code == 200, f"Expected 200, got {mres.status_code}"
        print(">> Prometheus metrics preview:\n" + "\n".join(mres.text.strip().splitlines()[:15]))
        assert "orbit_api_status 1" in mres.text
        assert "orbit_graph_nodes_total" in mres.text
        print(">> Prometheus metrics endpoint: VERIFIED!")

        # Test database read query via public endpoint or database directly
        from app.core.database import engine  # type: ignore[missing-import]
        from sqlalchemy import text
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT current_database(), current_user, count(*)::int from information_schema.tables where table_schema = 'public'"))
            row = result.fetchone()
            print(f">> Neon Orbit Database info: DB={row[0]}, User={row[1]}, Public Tables={row[2]}")

if __name__ == "__main__":
    asyncio.run(main())
