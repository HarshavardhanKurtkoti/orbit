from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import get_current_user, verify_workspace_access
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
    await verify_workspace_access(workspace_id, current_user.id, db)
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

    # Combine all entity counts into a single consolidated query to avoid 5 separate network round trips
    counts_query = select(
        select(func.count(Project.id)).where(Project.workspace_id == workspace_id).scalar_subquery(),
        select(func.count(Goal.id)).where(Goal.workspace_id == workspace_id).scalar_subquery(),
        select(func.count(Note.id)).where(Note.workspace_id == workspace_id).scalar_subquery(),
        select(func.count(GraphNode.id)).where(GraphNode.workspace_id == workspace_id).scalar_subquery(),
        select(func.count(GraphEdge.id)).where(GraphEdge.workspace_id == workspace_id).scalar_subquery(),
    )
    counts_row = (await db.execute(counts_query)).one()
    active_projects = counts_row[0] or 0
    active_goals = counts_row[1] or 0
    total_notes = counts_row[2] or 0
    node_count = counts_row[3] or 0
    edge_count = counts_row[4] or 0

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
