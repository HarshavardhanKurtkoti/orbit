from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    status: str = "todo"      # todo, in_progress, review, done
    priority: str = "medium"  # low, medium, high, urgent
    due_date: datetime | None = None
    parent_task_id: str | None = None


class TaskCreate(TaskBase):
    project_id: str


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    due_date: datetime | None = None
    completed_at: datetime | None = None
    parent_task_id: str | None = None


class TaskResponse(TaskBase):
    id: str
    project_id: str
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

