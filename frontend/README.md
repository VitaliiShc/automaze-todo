# Frontend

Next.js (App Router) frontend for the TODO application. See the [root README](../README.md)
for the full project overview and how to run backend + frontend together.

## Setup

```bash
npm install
cp .env.example .env.local
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires the backend running (see
`../backend/README.md`) and `NEXT_PUBLIC_API_URL` pointing at it.

## Checks

```bash
npx tsc --noEmit
npx eslint .
```
