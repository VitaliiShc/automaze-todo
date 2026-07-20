from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    priority: int = Field(ge=1, le=10)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    completed: bool | None = None
    priority: int | None = Field(default=None, ge=1, le=10)


class TaskResponse(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime
