# Project Plan

## Overview

Full-stack TODO application built with:

- Frontend: Next.js + React + TypeScript + Tailwind CSS
- Backend: FastAPI (Python)
- Database: PostgreSQL
- Deployment:
  - Frontend → Vercel
  - Backend → Render
  - Database → Render PostgreSQL

---

## User Features

The user can:

- View all tasks
- Create a new task
- Delete a task
- Mark a task as completed
- Search tasks by title
- Filter tasks by status (All / Done / Undone)
- Assign priority (1-10)
- Sort tasks by priority (Ascending / Descending)

---

## Data Model

### Task

| Field     | Type    | Description       |
| --------- | ------- | ----------------- |
| id        | string  | Unique identifier |
| title     | string  | Task title        |
| completed | boolean | Completion status |
| priority  | number  | Priority (1-10)   |
| createdAt | Date    | Creation date     |
| updatedAt | Date    | Last update date  |

---

## API

### Get all tasks

GET /api/tasks

Query parameters:

- search
- status
- sort
- order

Example:

GET /api/tasks?search=home&status=done&sort=priority&order=desc

---

### Create task

POST /api/tasks

Creates a new task.

---

### Update task

PATCH /api/tasks/{id}

Updates task title, priority or completion status.

---

### Delete task

DELETE /api/tasks/{id}

Deletes a task.

---

## Project Status

- [x] Repository created
- [x] Next.js project initialized
- [x] Frontend UI
- [x] Backend API
- [ ] PostgreSQL
- [x] Frontend ↔ Backend integration
- [ ] Tests
- [ ] Deployment
- [ ] Documentation
- [ ] Loom video
