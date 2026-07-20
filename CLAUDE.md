# Project Instructions

## Project

Full-stack TODO application.

## Stack

Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

Backend

- FastAPI
- SQLAlchemy
- PostgreSQL

Deployment

- Frontend → Vercel
- Backend → Render
- Database → Render PostgreSQL

---

## Coding Rules

- Keep changes small and focused.
- Never rewrite unrelated files.
- Reuse existing project structure.
- Use strict TypeScript.
- Use semantic HTML.
- Prefer composition over large components.
- Avoid unnecessary libraries.
- Keep components reusable.
- Follow Next.js App Router best practices.
- Follow FastAPI best practices.

---

## Workflow

Always:

1. Explain the implementation plan.
2. Wait if requirements are unclear.
3. Implement only the requested feature.
4. Explain what was changed.

---

## Frontend

- Prefer Server Components unless client-side state is required.
- Minimize use of "use client".
- Use Tailwind only.
- Do not add UI libraries unless requested.

---

## Backend

- Use FastAPI.
- Use SQLAlchemy ORM.
- Use Pydantic models.
- Separate routers, services and database logic.

---

## Tests

Prefer Playwright for E2E tests.
