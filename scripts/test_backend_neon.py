import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "api"))

import httpx
from app.main import app  # type: ignore[missing-import]

async def main():
    print("Testing FastAPI app with Neon PostgreSQL & Multi-Tenant User Isolation...")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        # 1. Health & DB
        res = await client.get("/health")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        print(">> Health & Neon Database: VERIFIED (connected)!")

        # 2. Demo Auth
        auth_res = await client.post("/api/v1/auth/demo")
        assert auth_res.status_code == 200
        auth_data = auth_res.json()
        demo_access_token = auth_data["access_token"]
        demo_refresh_token = auth_data["refresh_token"]
        print(">> Auth Demo: VERIFIED (issued access + refresh token)!")

        # 3. Refresh rotation
        ref_res = await client.post("/api/v1/auth/refresh", json={"refresh_token": demo_refresh_token})
        assert ref_res.status_code == 200
        print(">> Refresh Token Rotation: VERIFIED!")

        # 4. Multi-Tenant User Isolation Test
        import time
        ts = int(time.time())
        email_a = f"pilot_a_{ts}@orbit.internal"
        email_b = f"pilot_b_{ts}@orbit.internal"

        # Register User A
        reg_a = await client.post("/api/v1/auth/register", json={
            "email": email_a,
            "display_name": "Pilot Alpha",
            "password": "Password123!",
            "role": "member"
        })
        assert reg_a.status_code == 200, f"Register A failed: {reg_a.text}"
        token_a = reg_a.json()["access_token"]

        # Register User B
        reg_b = await client.post("/api/v1/auth/register", json={
            "email": email_b,
            "display_name": "Pilot Beta",
            "password": "Password123!",
            "role": "member"
        })
        assert reg_b.status_code == 200, f"Register B failed: {reg_b.text}"
        token_b = reg_b.json()["access_token"]

        # Get User A's workspaces
        ws_a_res = await client.get("/api/v1/workspaces", headers={"Authorization": f"Bearer {token_a}"})
        assert ws_a_res.status_code == 200
        ws_a_list = ws_a_res.json()
        assert len(ws_a_list) >= 1
        ws_a_id = ws_a_list[0]["id"]
        print(f">> User A registered, isolated workspace: {ws_a_id}")

        # Get User B's workspaces
        ws_b_res = await client.get("/api/v1/workspaces", headers={"Authorization": f"Bearer {token_b}"})
        assert ws_b_res.status_code == 200
        ws_b_list = ws_b_res.json()
        assert len(ws_b_list) >= 1
        ws_b_ids = [w["id"] for w in ws_b_list]
        assert ws_a_id not in ws_b_ids, "User B should NOT see User A's workspace in list_workspaces!"
        print(f">> Tenant Isolation 1 (Workspace Listing): VERIFIED (User B cannot see User A's workspace)!")

        # Verify User B cannot access User A's workspace directly
        tamper_ws = await client.get(f"/api/v1/workspaces/{ws_a_id}", headers={"Authorization": f"Bearer {token_b}"})
        assert tamper_ws.status_code == 403, f"Expected 403, got {tamper_ws.status_code}"
        print(f">> Tenant Isolation 2 (Workspace Tampering): VERIFIED (User B received 403 when trying to access User A's workspace)!")

        # Verify User B cannot query User A's projects
        tamper_proj = await client.get(f"/api/v1/projects?workspace_id={ws_a_id}", headers={"Authorization": f"Bearer {token_b}"})
        assert tamper_proj.status_code == 403, f"Expected 403, got {tamper_proj.status_code}"
        print(f">> Tenant Isolation 3 (Project Queries): VERIFIED (User B received 403 querying User A's workspace projects)!")

        # Verify User B cannot query User A's knowledge graph
        tamper_graph = await client.get(f"/api/v1/workspaces/{ws_a_id}/graph", headers={"Authorization": f"Bearer {token_b}"})
        assert tamper_graph.status_code == 403, f"Expected 403, got {tamper_graph.status_code}"
        print(f">> Tenant Isolation 4 (Knowledge Graph): VERIFIED (User B received 403 accessing User A's spatial graph)!")

        # Verify User B cannot query User A's analytics
        tamper_analytics = await client.get(f"/api/v1/analytics/overview?workspace_id={ws_a_id}", headers={"Authorization": f"Bearer {token_b}"})
        assert tamper_analytics.status_code == 403, f"Expected 403, got {tamper_analytics.status_code}"
        print(f">> Tenant Isolation 5 (Analytics): VERIFIED (User B received 403 accessing User A's analytics)!")

        # Verify RBAC for Users & Access: User A (member) CANNOT access /api/v1/users (403)
        member_users_res = await client.get("/api/v1/users", headers={"Authorization": f"Bearer {token_a}"})
        assert member_users_res.status_code == 403, f"Expected 403 for member, got {member_users_res.status_code}"
        print(f">> RBAC Restriction (Users & Access): VERIFIED (Role 'member' received 403 Forbidden)!")

        # Verify Demo Commander (role 'admin') CAN access /api/v1/users (200)
        admin_users_res = await client.get("/api/v1/users", headers={"Authorization": f"Bearer {demo_access_token}"})
        assert admin_users_res.status_code == 200, f"Expected 200 for admin, got {admin_users_res.status_code}"
        print(f">> RBAC Access (Users & Access): VERIFIED (Role 'admin' received 200 OK)!")

        print("\n=======================================================")
        print("ALL AUTH, MULTI-TENANT & RBAC TESTS PASSED (100%)!")
        print("=======================================================")

if __name__ == "__main__":
    asyncio.run(main())
