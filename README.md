# Automaze Todo

Full-stack TODO application with Google OAuth authentication.

Users can securely manage their own tasks through a responsive interface with
search, filtering, priority sorting, and JWT-based authentication.

The frontend is built with Next.js, while the backend uses FastAPI with
PostgreSQL in production and SQLite for local development.

## Live Demo

- Frontend: <https://vitalishc-automaze-todo.vercel.app/>
- Backend API (Swagger): <https://automaze-backend.onrender.com/docs>
- Health check: <https://automaze-backend.onrender.com/health>

## Architecture

- Frontend: Next.js (Vercel)
- Backend: FastAPI (Render)
- Authentication: Google OAuth + JWT
- Database: PostgreSQL (Render)

## Tech stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Google Identity Services
- Tailwind CSS

### Backend

- FastAPI
- SQLAlchemy 2.x (`Mapped`/`mapped_column` style)
- Pydantic v2
- Alembic (migrations)
- PostgreSQL (production)
- SQLite (local development)
- Google OAuth token verification
- JWT authentication

## Project structure

```text
automaze-todo/
├── frontend/                    Next.js App Router application
│   ├── app/
│   │   ├── layout.tsx           Root layout, fonts, global CSS
│   │   └── page.tsx             Client Component: owns task + auth state, Google login/logout
│   ├── components/task/         Presentational task components (TaskList, TaskItem, ...)
│   ├── lib/api.ts                API client: getTasks/createTask/updateTask/deleteTask/loginWithGoogle
│   ├── types/task.ts             Task, Priority, StatusFilter, SortOrder types
│   └── .env.local                 NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID (not committed)
│
└── backend/                     FastAPI application
    ├── app/
    │   ├── main.py                FastAPI app, CORS, /health, router registration
    │   ├── config.py              Settings (pydantic-settings), reads .env
    │   ├── rate_limit.py          In-memory rate limiting (per-IP login, per-user mutations)
    │   ├── database/              Engine, Base, Session, get_db() dependency
    │   ├── models/
    │   │   ├── task.py            SQLAlchemy ORM model (Task, owned by a User)
    │   │   └── user.py            SQLAlchemy ORM model (User, created on first Google login)
    │   ├── schemas/
    │   │   ├── auth.py            Pydantic schemas (GoogleLoginRequest/TokenResponse/UserResponse)
    │   │   └── task.py            Pydantic schemas (TaskCreate/TaskUpdate/TaskResponse)
    │   ├── routers/
    │   │   ├── auth.py            Thin HTTP layer for /api/auth/google
    │   │   └── tasks.py           Thin HTTP layer for /api/tasks (JWT-protected)
    │   └── services/
    │       ├── auth_service.py    Google token verification, JWT issuing, get_current_user
    │       └── task_service.py    Business logic (used by routers via DI)
    ├── alembic/                   Migrations (env.py reads DATABASE_URL from Settings)
    └── .env                       DATABASE_URL, CORS_ORIGINS, GOOGLE_CLIENT_ID, JWT_SECRET (not committed)
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
cp .env.example .env        # Populate GOOGLE_CLIENT_ID, JWT_SECRET and other required variables before starting the backend.

alembic upgrade head        # creates the SQLite database (app.db) and the tasks table
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. `GET /health` should return `{"status": "ok"}`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # Populate NEXT_PUBLIC_GOOGLE_CLIENT_ID before running the application.

npm run dev
```

Frontend runs at `http://localhost:3000` and talks to the backend via `NEXT_PUBLIC_API_URL`.

## Environment variables

### `backend/.env` (see `backend/.env.example`)

| Variable              | Default                     | Purpose                                                                                                                                                                |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | `sqlite:///./app.db`        | SQLAlchemy connection string. Change to `postgresql+psycopg://user:pass@host/db` to switch to PostgreSQL — no code changes needed.                                     |
| `CORS_ORIGINS`        | `["http://localhost:3000"]` | JSON array of origins allowed to call the API.                                                                                                                         |
| `GOOGLE_CLIENT_ID`    | _(required, no default)_    | OAuth client ID used to verify Google ID tokens (`verify_oauth2_token` audience check) in `auth_service.py`. Must match the frontend's `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. |
| `JWT_SECRET`          | _(required, no default)_    | Secret key used to sign and verify the backend's own access tokens (HS256). Must be a strong, unique value in production.                                              |
| `JWT_EXPIRES_MINUTES` | `10080` (7 days)            | Lifetime of an issued JWT access token, in minutes.                                                                                                                    |

### `frontend/.env.local` (see `frontend/.env.example`)

| Variable                       | Default                  | Purpose                                                                                                                               |
| ------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | `http://localhost:8000`  | Base URL the frontend uses for all API calls (`frontend/lib/api.ts`). Never hardcoded in source.                                      |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | _(required, no default)_ | Google OAuth client ID used to render the Google Sign-In button (`GoogleOAuthProvider`). Must match the backend's `GOOGLE_CLIENT_ID`. |

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

| Method   | Path               | Description                                              | Auth |
| -------- | ------------------ | -------------------------------------------------------- | ---- |
| `GET`    | `/health`          | Health check → `{"status": "ok"}`                        | -    |
| `GET`    | `/api/tasks`       | List all tasks, sorted by `created_at` descending        | JWT  |
| `POST`   | `/api/tasks`       | Create a task (`title`, `priority`)                      | JWT  |
| `PATCH`  | `/api/tasks/{id}`  | Partially update a task (`title`/`completed`/`priority`) | JWT  |
| `DELETE` | `/api/tasks/{id}`  | Delete a task → `204 No Content`                         | JWT  |
| `POST`   | `/api/auth/google` | Exchange a Google ID token for a JWT access token        | -    |

## Features

- Google OAuth authentication
- JWT-based API authorization
- Personal task isolation
- Create, update and delete tasks
- Search by title
- Status filtering
- Priority sorting
- Responsive UI
- Rate limiting against API abuse
- Automatic database migrations on deployment

## Security

- Google OAuth authentication
- JWT authorization
- Per-user task isolation
- Request rate limiting
- Maximum number of tasks per user
- Input validation with Pydantic
- Alembic database migrations

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

The backend automatically applies database migrations during startup:

```bash
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Database migrations are applied automatically during every deployment before
the application starts.
