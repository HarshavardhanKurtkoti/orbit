from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.task import Task
from app.models.project import Project
from app.models.graph import GraphNode
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter()


@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    project_id: str | None = None,
    workspace_id: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Task)
    if project_id:
        query = query.where(Task.project_id == project_id)
    elif workspace_id:
        query = query.join(Project, Task.project_id == Project.id).where(Project.workspace_id == workspace_id)
        
    query = query.order_by(Task.created_at.desc())
    result = await db.execute(query)
    tasks = result.scalars().all()
    return [TaskResponse.model_validate(t) for t in tasks]


@router.post("", response_model=TaskResponse)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Fetch project to get workspace_id
    project_result = await db.execute(select(Project).where(Project.id == task_in.project_id))
    project = project_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    task = Task(
        project_id=task_in.project_id,
        parent_task_id=task_in.parent_task_id,
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        due_date=task_in.due_date,
    )
    db.add(task)
    await db.flush()

    # Automatically create a graph node for this task
    graph_node = GraphNode(
        workspace_id=project.workspace_id,
        entity_type="task",
        entity_id=task.id,
        position_x=250.0,
        position_y=150.0,
        metadata_json={"title": task.title, "priority": task.priority, "status": task.status},
    )
    db.add(graph_node)

    await db.commit()
    await db.refresh(task)
    return TaskResponse.model_validate(task)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_in.model_dump(exclude_unset=True)
    if update_data.get("status") == "done" and not task.completed_at:
        task.completed_at = datetime.now(timezone.utc)
    elif update_data.get("status") and update_data.get("status") != "done":
        task.completed_at = None

    for field, value in update_data.items():
        setattr(task, field, value)

    # Sync metadata on graph node if needed
    node_result = await db.execute(select(GraphNode).where(GraphNode.entity_id == task_id))
    node = node_result.scalar_one_or_none()
    if node:
        meta = dict(node.metadata_json or {})
        meta["status"] = task.status
        meta["title"] = task.title
        node.metadata_json = meta

    await db.commit()
    await db.refresh(task)
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Delete corresponding graph node
    graph_node_result = await db.execute(
        select(GraphNode).where(GraphNode.entity_id == task_id)
    )
    for node in graph_node_result.scalars().all():
        await db.delete(node)

    await db.delete(task)
    await db.commit()
    return {"status": "success", "message": "Task deleted"}
