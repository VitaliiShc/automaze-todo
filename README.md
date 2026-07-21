# Automaze Todo

Full-stack TODO application: a clean, responsive task manager with search, status
filtering, priority sorting, and a FastAPI backend powered by PostgreSQL in
production and SQLite for local development.

## Live Demo

- Frontend: <https://vitalishc-automaze-todo.vercel.app/>
- Backend API (Swagger): <https://automaze-backend.onrender.com/docs>
- Health check: <https://automaze-backend.onrender.com/health>

## Architecture

- Frontend: Next.js (Vercel)
- Backend: FastAPI (Render)
- Database: PostgreSQL (Render)

## Tech stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS

### Backend

- FastAPI
- SQLAlchemy 2.x (`Mapped`/`mapped_column` style)
- Pydantic v2
- Alembic (migrations)
- PostgreSQL (production)
- SQLite (local development)

## Project structure

```text
automaze-todo/
├── frontend/                    Next.js App Router application
│   ├── app/
│   │   ├── layout.tsx           Root layout, fonts, global CSS
│   │   └── page.tsx             Client Component: owns task state, fetches from the API
│   ├── components/task/         Presentational task components (TaskList, TaskItem, ...)
│   ├── lib/api.ts                API client: getTasks/createTask/updateTask/deleteTask
│   ├── types/task.ts             Task, Priority, StatusFilter, SortOrder types
│   └── .env.local                 NEXT_PUBLIC_API_URL (not committed)
│
└── backend/                     FastAPI application
    ├── app/
    │   ├── main.py                FastAPI app, CORS, /health, router registration
    │   ├── config.py              Settings (pydantic-settings), reads .env
    │   ├── database/              Engine, Base, Session, get_db() dependency
    │   ├── models/task.py         SQLAlchemy ORM model
    │   ├── schemas/task.py        Pydantic schemas (TaskCreate/TaskUpdate/TaskResponse)
    │   ├── routers/tasks.py       Thin HTTP layer for /api/tasks
    │   └── services/task_service.py  Business logic (used by routers via DI)
    ├── alembic/                   Migrations (env.py reads DATABASE_URL from Settings)
    └── .env                       DATABASE_URL, CORS_ORIGINS (not committed)
```

## Quick start

Run backend and frontend in two terminals.

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate      # Windows
source .venv/bin/activate   # macOS/Linux

pip install -r requirements-dev.txt
cp .env.example .env

alembic upgrade head         # creates the SQLite database (app.db) and the tasks table
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. `GET /health` should return `{"status": "ok"}`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local

npm run dev
```

Frontend runs at `http://localhost:3000` and talks to the backend via `NEXT_PUBLIC_API_URL`.

## Environment variables

### `backend/.env` (see `backend/.env.example`)

| Variable       | Default                     | Purpose                                                                                                                            |
| -------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | `sqlite:///./app.db`        | SQLAlchemy connection string. Change to `postgresql+psycopg://user:pass@host/db` to switch to PostgreSQL — no code changes needed. |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | JSON array of origins allowed to call the API.                                                                                     |

### `frontend/.env.local` (see `frontend/.env.example`)

| Variable              | Default                 | Purpose                                                                                          |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Base URL the frontend uses for all API calls (`frontend/lib/api.ts`). Never hardcoded in source. |

## Database & migrations (backend)

The app uses SQLite for local development (`backend/app.db`, gitignored). Schema changes
are managed exclusively through Alembic — the ORM never creates tables itself.

```bash
cd backend
alembic upgrade head                              # apply all migrations
alembic revision --autogenerate -m "description"  # generate a new migration after model changes
```

## Checks

Run these from each project's own directory.

### Frontend checks

```bash
cd frontend
npx tsc --noEmit   # typecheck
npx eslint .        # lint
```

### Backend checks

```bash
cd backend
.venv/Scripts/python.exe -m mypy app              # typecheck (strict)
.venv/Scripts/python.exe -m ruff check app alembic # lint
```

## API

| Method   | Path              | Description                                              |
| -------- | ----------------- | -------------------------------------------------------- |
| `GET`    | `/health`         | Health check → `{"status": "ok"}`                        |
| `GET`    | `/api/tasks`      | List all tasks, sorted by `created_at` descending        |
| `POST`   | `/api/tasks`      | Create a task (`title`, `priority`)                      |
| `PATCH`  | `/api/tasks/{id}` | Partially update a task (`title`/`completed`/`priority`) |
| `DELETE` | `/api/tasks/{id}` | Delete a task → `204 No Content`                         |

## Features

- Display, add, and remove tasks
- Search tasks by title (case-insensitive)
- Mark tasks as done / undone
- Filter by status (all / done / undone)
- Assign priority (1–10, color-coded badge)
- Sort by priority (ascending / descending)

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

The backend automatically applies database migrations during startup:

```bash
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
