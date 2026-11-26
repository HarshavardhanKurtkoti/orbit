from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user, verify_workspace_access
from app.models.user import User
from app.models.project import Project
from app.models.graph import GraphNode
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter()


@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_workspace_access(workspace_id, current_user.id, db)
    query = select(Project).where(Project.workspace_id == workspace_id).order_by(Project.created_at.desc())
    result = await db.execute(query)
    projects = result.scalars().all()
    return [ProjectResponse.model_validate(p) for p in projects]


@router.post("", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_workspace_access(project_in.workspace_id, current_user.id, db)
    project = Project(
        workspace_id=project_in.workspace_id,
        title=project_in.title,
        description=project_in.description,
        status=project_in.status,
        priority=project_in.priority,
        progress=project_in.progress,
        start_date=project_in.start_date,
        due_date=project_in.due_date,
    )
    db.add(project)
    await db.flush()

    # Automatically create a graph node for this project
    graph_node = GraphNode(
        workspace_id=project.workspace_id,
        entity_type="project",
        entity_id=project.id,
        position_x=100.0,
        position_y=100.0,
        metadata_json={"title": project.title, "priority": project.priority},
    )
    db.add(graph_node)

    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Delete corresponding graph node
    graph_node_result = await db.execute(
        select(GraphNode).where(GraphNode.entity_id == project_id)
    )
    for node in graph_node_result.scalars().all():
        await db.delete(node)

    await db.delete(project)
    await db.commit()
    return {"status": "success", "message": "Project deleted"}
