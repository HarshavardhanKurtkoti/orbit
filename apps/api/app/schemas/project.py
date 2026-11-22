from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str
    description: str | None = None
    status: str = "in_progress"  # planned, in_progress, completed, on_hold
    priority: str = "medium"    # low, medium, high, urgent
    progress: int = 0
    start_date: datetime | None = None
    due_date: datetime | None = None


class ProjectCreate(ProjectBase):
    workspace_id: str


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    progress: int | None = None
    start_date: datetime | None = None
    due_date: datetime | None = None


class ProjectResponse(ProjectBase):
    id: str
    workspace_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

