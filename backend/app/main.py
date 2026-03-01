from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select
from .db import Base, engine, get_db
from .models import Task, TaskStatus
from .schemas import LoginRequest, TokenResponse, TaskCreate, TaskUpdate, TaskOut
from .auth import DEMO_USER, verify_password, create_access_token, get_current_user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tasks API")

FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "https://task-web-wnbe.onrender.com/",  # <- cambia esto por tu URL real
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,  # ajusta cuando deployes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    if body.username != DEMO_USER["username"] or not verify_password(body.password, DEMO_USER["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=body.username)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/tasks", response_model=list[TaskOut])
def list_tasks(
    status: TaskStatus | None = Query(default=None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user),
):
    stmt = select(Task)
    if status:
        stmt = stmt.where(Task.status == status)
    return db.scalars(stmt.order_by(Task.created_at.desc())).all()

@app.post("/tasks", response_model=TaskOut, status_code=201)
def create_task(
    body: TaskCreate,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user),
):
    task = Task(**body.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    body: TaskUpdate,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user),
):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for k, v in body.model_dump().items():
        setattr(task, k, v)
    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user),
):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return