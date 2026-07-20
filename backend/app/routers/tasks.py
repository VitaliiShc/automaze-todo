from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def _not_implemented() -> None:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Task endpoints are not implemented yet.",
    )


@router.get("")
def list_tasks() -> None:
    _not_implemented()


@router.post("")
def create_task() -> None:
    _not_implemented()
