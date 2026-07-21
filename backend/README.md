# Backend

FastAPI backend for the TODO application, built with SQLAlchemy, Alembic and
PostgreSQL (SQLite for local development).

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
- `GET /api/tasks` → list all tasks, sorted by `created_at` descending
- `POST /api/tasks` → create a task (`title`, `priority`)
- `PATCH /api/tasks/{id}` → partially update a task (`title`/`completed`/`priority`); `404` if missing
- `DELETE /api/tasks/{id}` → `204 No Content`; `404` if missing

## Database

Local development uses SQLite by default (`DATABASE_URL` in `.env`).

To use PostgreSQL, update `DATABASE_URL` to a
`postgresql+psycopg://...` connection string. No code changes are required.

## Migrations

Database schema changes are managed with Alembic.

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Checks

```bash
python -m mypy app
python -m ruff check app alembic
```

## Deployment

Production deployment uses:

- Render Web Service
- Render PostgreSQL
- Alembic migrations applied automatically on startup
