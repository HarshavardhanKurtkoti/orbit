import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        live_res = await ac.get("/health/live")
        assert live_res.status_code == 200
        assert live_res.json()["status"] == "live"

        ready_res = await ac.get("/health/ready")
        assert ready_res.status_code == 200
        assert ready_res.json()["status"] == "ready"


@pytest.mark.asyncio
async def test_demo_login_and_workspaces():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Demo login
        login_res = await ac.post("/api/v1/auth/demo")
        assert login_res.status_code == 200
        token_data = login_res.json()
        assert "access_token" in token_data
        token = token_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # List workspaces
        ws_res = await ac.get("/api/v1/workspaces", headers=headers)
        assert ws_res.status_code == 200
        workspaces = ws_res.json()
        assert len(workspaces) > 0
        ws_id = workspaces[0]["id"]

        # List projects in workspace
        proj_res = await ac.get(f"/api/v1/projects?workspace_id={ws_id}", headers=headers)
        assert proj_res.status_code == 200
        projects = proj_res.json()
        assert len(projects) >= 2

        # Get workspace graph
        graph_res = await ac.get(f"/api/v1/workspaces/{ws_id}/graph", headers=headers)
        assert graph_res.status_code == 200
        graph = graph_res.json()
        assert len(graph["nodes"]) > 0
        assert len(graph["edges"]) > 0

        # Get analytics overview
        analytics_res = await ac.get(f"/api/v1/analytics/overview?workspace_id={ws_id}", headers=headers)
        assert analytics_res.status_code == 200
        analytics = analytics_res.json()
        assert analytics["total_tasks"] > 0
        assert analytics["active_projects"] >= 2
