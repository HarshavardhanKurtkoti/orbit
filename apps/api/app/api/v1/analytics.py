from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.note import Note
from app.models.goal import Goal
from app.models.graph import GraphNode, GraphEdge
from app.schemas.analytics import ProductivityOverviewResponse

router = APIRouter()


@router.get("/overview", response_model=ProductivityOverviewResponse)
async def get_overview(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Total & completed tasks for this workspace
    tasks_query = (
        select(Task.status, func.count(Task.id))
        .join(Project, Task.project_id == Project.id)
        .where(Project.workspace_id == workspace_id)
        .group_by(Task.status)
    )
    tasks_res = await db.execute(tasks_query)
    task_counts = dict(tasks_res.all())

    total_tasks = sum(task_counts.values())
    completed_tasks = task_counts.get("done", 0)
    completion_rate = (completed_tasks / total_tasks * 100.0) if total_tasks > 0 else 0.0

    # Active projects
    proj_query = select(func.count(Project.id)).where(Project.workspace_id == workspace_id)
    active_projects = (await db.execute(proj_query)).scalar() or 0

    # Active goals
    goals_query = select(func.count(Goal.id)).where(Goal.workspace_id == workspace_id)
    active_goals = (await db.execute(goals_query)).scalar() or 0

    # Notes
    notes_query = select(func.count(Note.id)).where(Note.workspace_id == workspace_id)
    total_notes = (await db.execute(notes_query)).scalar() or 0

    # Graph nodes & edges
    nodes_query = select(func.count(GraphNode.id)).where(GraphNode.workspace_id == workspace_id)
    edges_query = select(func.count(GraphEdge.id)).where(GraphEdge.workspace_id == workspace_id)
    node_count = (await db.execute(nodes_query)).scalar() or 0
    edge_count = (await db.execute(edges_query)).scalar() or 0

    return ProductivityOverviewResponse(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        completion_rate=round(completion_rate, 1),
        active_projects=active_projects,
        overdue_tasks=0,
        active_goals=active_goals,
        total_notes=total_notes,
        graph_density_nodes=node_count,
        graph_density_edges=edge_count,
    )
