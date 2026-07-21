# Frontend

Next.js (App Router) frontend for the Automaze TODO application.

Built with React, TypeScript and Tailwind CSS. The application authenticates
users with Google Sign-In, stores the JWT issued by the backend, and communicates
with the REST API.

See the [root README](../README.md) for the full project overview.

## Setup

```bash
npm install
cp .env.example .env.local
```

## Environment variables

| Variable                       | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Base URL of the backend API.                   |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID used by Google Sign-In. |

## Run

```bash
npm run dev
```

The application will be available at <http://localhost:3000>.

Make sure the backend is running and that:

- `NEXT_PUBLIC_API_URL` points to the backend API.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` matches the Google OAuth client configured for the backend.

## Checks

```bash
npx tsc --noEmit
npx eslint .
```

## Features

- Google Sign-In authentication
- JWT-based API authentication
- Personal task list
- Create, edit and delete tasks
- Search, filtering and priority sorting
- Responsive UI

## Deployment

The production frontend is deployed on Vercel.
