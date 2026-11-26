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
        assert "orbit_api_status 1" in mres.text
        print(">> Prometheus metrics endpoint: VERIFIED!")

        # Test Auth Demo endpoint
        auth_res = await client.post("/api/v1/auth/demo")
        print("POST /api/v1/auth/demo status:", auth_res.status_code)
        assert auth_res.status_code == 200, f"Expected 200, got {auth_res.status_code}: {auth_res.text}"
        auth_data = auth_res.json()
        access_token = auth_data.get("access_token")
        refresh_token = auth_data.get("refresh_token")
        assert access_token, "access_token missing from auth response"
        assert refresh_token, "refresh_token missing from auth response"
        print(f">> Auth tokens generated: access_token prefix={access_token[:15]}..., refresh_token prefix={refresh_token[:15]}...")

        # Test Auth Refresh endpoint
        ref_res = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
        print("POST /api/v1/auth/refresh status:", ref_res.status_code)
        assert ref_res.status_code == 200, f"Expected 200, got {ref_res.status_code}: {ref_res.text}"
        new_token_data = ref_res.json()
        assert new_token_data.get("access_token"), "new access_token missing"
        assert new_token_data.get("refresh_token"), "new refresh_token missing"
        print(">> Refresh token rotation: VERIFIED!")

        # Test Users List endpoint
        headers = {"Authorization": f"Bearer {access_token}"}
        users_res = await client.get("/api/v1/users", headers=headers)
        print("GET /api/v1/users status:", users_res.status_code)
        assert users_res.status_code == 200, f"Expected 200, got {users_res.status_code}: {users_res.text}"
        users_data = users_res.json()
        assert "users" in users_data
        print(f">> Users API verified: Total users={users_data.get('total')}, returned count={len(users_data.get('users'))}")

        # Test database read query directly
        from app.core.database import engine  # type: ignore[missing-import]
        from sqlalchemy import text
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT current_database(), current_user, count(*)::int from information_schema.tables where table_schema = 'public'"))
            row = result.fetchone()
            if row is not None:
                print(f">> Neon Orbit Database info: DB={row[0]}, User={row[1]}, Public Tables={row[2]}")
            else:
                print(">> Neon Orbit Database info: Connected (empty query result)")

if __name__ == "__main__":
    asyncio.run(main())
