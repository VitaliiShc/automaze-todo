# Frontend

Next.js (App Router) frontend for the TODO application, built with React,
TypeScript and Tailwind CSS.

See the [root README](../README.md) for the full project overview.

## Setup

```bash
npm install
cp .env.example .env.local
```

## Environment variables

| Variable              | Purpose                      |
| --------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API. |

## Run

```bash
npm run dev
```

The application will be available at <http://localhost:3000>.

Make sure the backend is running and
`NEXT_PUBLIC_API_URL` points to it (see `../backend/README.md`).

## Checks

```bash
npx tsc --noEmit
npx eslint .
```

## Deployment

The production frontend is deployed on Vercel.
