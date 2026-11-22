from datetime import datetime
from pydantic import BaseModel, ConfigDict


class GoalBase(BaseModel):
    title: str
    description: str | None = None
    target_date: datetime | None = None
    progress: int = 0
    milestones: list[dict] = []


class GoalCreate(GoalBase):
    workspace_id: str


class GoalUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    target_date: datetime | None = None
    progress: int | None = None
    milestones: list[dict] | None = None


class GoalResponse(GoalBase):
    id: str
    workspace_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

