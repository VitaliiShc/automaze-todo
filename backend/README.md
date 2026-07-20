# Backend

FastAPI backend for the TODO application.

## Setup

```bash
python -m venv .venv
.venv/Scripts/activate   # Windows
source .venv/bin/activate  # macOS/Linux

pip install -r requirements-dev.txt
cp .env.example .env
```

## Run

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

- `GET /health` → `{"status": "ok"}`
- `GET /api/tasks`, `POST /api/tasks` → `501 Not Implemented` (CRUD not implemented yet)

## Database

Defaults to a local SQLite file (`DATABASE_URL` in `.env`). Switch to PostgreSQL by changing
`DATABASE_URL` to a `postgresql+psycopg://...` connection string — no code changes required.

## Migrations

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Checks

```bash
mypy app
ruff check app alembic
```
