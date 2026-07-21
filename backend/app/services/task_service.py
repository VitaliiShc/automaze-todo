from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


def get_tasks(db: Session, user_id: int) -> list[Task]:
    statement = (
        select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    )
    return list(db.execute(statement).scalars().all())


def create_task(db: Session, task_in: TaskCreate, user_id: int) -> Task:
    task = Task(title=task_in.title, priority=task_in.priority, completed=False, user_id=user_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def _get_task_or_404(db: Session, task_id: int, user_id: int) -> Task:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = db.execute(statement).scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
    return task


def update_task(db: Session, task_id: int, task_in: TaskUpdate, user_id: int) -> Task:
    task = _get_task_or_404(db, task_id, user_id)

    for field, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int, user_id: int) -> None:
    task = _get_task_or_404(db, task_id, user_id)
    db.delete(task)
    db.commit()
