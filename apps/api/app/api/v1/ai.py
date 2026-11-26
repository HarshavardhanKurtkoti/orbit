from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.workspace import Workspace
from app.models.ai import AiGenerationJob
from app.models.project import Project
from app.models.task import Task
from app.models.goal import Goal
from app.models.graph import GraphNode, GraphEdge
from app.schemas.ai import (
    AiJobConfirmRequest,
    AiJobResponse,
    AiPromptRequest,
    AiGeneratedPlan,
)
from app.services.ai_service import AiWorkspaceService

router = APIRouter()


@router.post("/generate-workspace", response_model=AiJobResponse)
async def generate_workspace_job(
    request: AiPromptRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    target_workspace_id = request.workspace_id
    # Validate or resolve workspace for user
    ws_result = await db.execute(
        select(Workspace).where(Workspace.id == target_workspace_id)
    )
    ws = ws_result.scalar_one_or_none()
    if not ws:
        user_ws_result = await db.execute(
            select(Workspace).where(Workspace.owner_id == current_user.id).limit(1)
        )
        ws = user_ws_result.scalar_one_or_none()
        if not ws:
            ws = Workspace(
                owner_id=current_user.id,
                name="Cosmos Prime",
                description="Primary deep space command workspace",
                settings={"theme": "space-dark", "layout": "spatial"},
            )
            db.add(ws)
            await db.flush()
        target_workspace_id = ws.id

    job = AiGenerationJob(
        workspace_id=target_workspace_id,
        user_id=current_user.id,
        prompt=request.prompt,
        status="processing",
    )
    db.add(job)
    await db.commit()

    try:
        plan_dict = await AiWorkspaceService.generate_plan(request.prompt)
        job.result = plan_dict
        job.status = "completed"
        job.completed_at = datetime.now(timezone.utc)
    except Exception as e:
        job.status = "failed"
        job.error_message = str(e)
        job.completed_at = datetime.now(timezone.utc)

    await db.commit()
    return AiJobResponse.model_validate(job)


@router.get("/jobs/{job_id}", response_model=AiJobResponse)
async def get_ai_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AiGenerationJob).where(AiGenerationJob.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="AI job not found")
    return AiJobResponse.model_validate(job)


@router.post("/jobs/{job_id}/confirm")
async def confirm_ai_job(
    job_id: str,
    confirm_in: AiJobConfirmRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AiGenerationJob).where(AiGenerationJob.id == job_id))
    job = result.scalar_one_or_none()
    
    workspace_id = confirm_in.workspace_id or (job.workspace_id if job else None)
    if not workspace_id:
        ws_res = await db.execute(select(Workspace).where(Workspace.owner_id == current_user.id).limit(1))
        ws = ws_res.scalar_one_or_none()
        if ws:
            workspace_id = ws.id
        else:
            raise HTTPException(status_code=404, detail="Workspace not found")

    plan = confirm_in.plan

    # Create Goal representing the overall plan
    goal = Goal(
        workspace_id=workspace_id,
        title=plan.title,
        description=plan.description,
        progress=0,
        milestones=[m.model_dump() for m in plan.milestones],
    )
    db.add(goal)
    await db.flush()

    goal_node = GraphNode(
        workspace_id=workspace_id,
        entity_type="goal",
        entity_id=goal.id,
        position_x=450.0,
        position_y=60.0,
        metadata_json={"title": goal.title, "type": "goal"},
    )
    db.add(goal_node)
    await db.flush()

    # Materialize projects & tasks transactionally
    x_offset = 120.0
    for p_idx, p_data in enumerate(plan.projects):
        project = Project(
            workspace_id=workspace_id,
            title=p_data.title,
            description=p_data.description,
            priority=p_data.priority,
            status="in_progress",
            progress=0,
        )
        db.add(project)
        await db.flush()

        proj_node = GraphNode(
            workspace_id=workspace_id,
            entity_type="project",
            entity_id=project.id,
            position_x=x_offset + (p_idx * 340.0),
            position_y=220.0,
            metadata_json={"title": project.title, "priority": project.priority},
        )
        db.add(proj_node)
        await db.flush()

        # Connect goal to project
        edge = GraphEdge(
            workspace_id=workspace_id,
            source_node_id=goal_node.id,
            target_node_id=proj_node.id,
            relationship_type="parent_of",
        )
        db.add(edge)

        # Create tasks
        for t_idx, t_data in enumerate(p_data.tasks):
            task = Task(
                project_id=project.id,
                title=t_data.title,
                priority=t_data.priority,
                status="todo",
            )
            db.add(task)
            await db.flush()

            task_node = GraphNode(
                workspace_id=workspace_id,
                entity_type="task",
                entity_id=task.id,
                position_x=x_offset + (p_idx * 340.0) + (t_idx * 30.0 - 30.0),
                position_y=380.0 + (t_idx * 110.0),
                metadata_json={"title": task.title, "priority": task.priority, "status": "todo"},
            )
            db.add(task_node)
            await db.flush()

            # Connect project to task
            t_edge = GraphEdge(
                workspace_id=workspace_id,
                source_node_id=proj_node.id,
                target_node_id=task_node.id,
                relationship_type="parent_of",
            )
            db.add(t_edge)

    await db.commit()
    return {"status": "success", "message": "Plan materialized into workspace"}
