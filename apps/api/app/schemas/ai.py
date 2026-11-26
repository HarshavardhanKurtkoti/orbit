from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Any



class TaskBlueprint(BaseModel):
    title: str
    priority: str = "medium"
    estimated_hours: int = 4


class ProjectBlueprint(BaseModel):
    title: str
    description: str = ""
    priority: str = "medium"
    tasks: list[TaskBlueprint] = []


class MilestoneBlueprint(BaseModel):
    title: str
    target_week: int = 1


class AiGeneratedPlan(BaseModel):
    title: str
    description: str = ""
    projects: list[ProjectBlueprint] = []
    milestones: list[MilestoneBlueprint] = []


class AiPromptRequest(BaseModel):
    workspace_id: str
    prompt: str


class AiJobResponse(BaseModel):
    id: str
    workspace_id: str
    user_id: str
    prompt: str
    status: str
    result: dict[str, Any] | None = None
    error_message: str | None = None
    created_at: datetime
    completed_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)



class AiJobConfirmRequest(BaseModel):
    plan: AiGeneratedPlan
    workspace_id: str | None = None
