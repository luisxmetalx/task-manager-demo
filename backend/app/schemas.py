from datetime import datetime
from pydantic import BaseModel, Field
from .models import TaskStatus, TaskPriority

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus = TaskStatus.pending
    priority: TaskPriority = TaskPriority.medium

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskOut(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}