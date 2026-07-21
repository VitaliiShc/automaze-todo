# Backend

FastAPI backend for the TODO application, built with SQLAlchemy, Alembic and
PostgreSQL (SQLite for local development).

See the [root README](../README.md) for the complete project overview.

## Setup

```bash
python -m venv .venv
.venv/Scripts/activate      # Windows
source .venv/bin/activate   # macOS/Linux

pip install -r requirements-dev.txt
cp .env.example .env
```

## Environment variables

Configure the application using `backend/.env` (see `.env.example`).

Required variables:

- `DATABASE_URL`
- `CORS_ORIGINS`
- `GOOGLE_CLIENT_ID`
- `JWT_SECRET`
- `JWT_EXPIRES_MINUTES`

## Run

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

The API will be available at:

- <http://localhost:8000>
- Swagger UI: <http://localhost:8000/docs>

## API

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| GET    | `/health`          | Health check              |
| POST   | `/api/auth/google` | Google OAuth login        |
| GET    | `/api/tasks`       | List current user's tasks |
| POST   | `/api/tasks`       | Create task               |
| PATCH  | `/api/tasks/{id}`  | Update task               |
| DELETE | `/api/tasks/{id}`  | Delete task               |

## Security

- Google OAuth authentication
- JWT Bearer tokens
- Protected task endpoints
- Per-user task isolation
- In-memory rate limiting
- Maximum 500 tasks per user

## Database

SQLite is used for local development.

Production uses PostgreSQL.

Database schema changes are managed exclusively through Alembic.

## Migrations

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
- Alembic migrations applied automatically during startup
