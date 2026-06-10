# Mini Reconciliation Dashboard

Next.js frontend for a compact payment reconciliation dashboard.

## Requirements

Recommended local versions:

```bash
node -v  # v24.16.0
npm -v   # 11.13.0
```

Node.js `20.9.0` or newer is required by Next.js 15. Use the versions above,
or install a current Node LTS/recent release before running setup.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend API

Create `.env` with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

The dashboard calls:

```bash
GET /kpi
GET /reconciliation
```

## Build

```bash
npm run build
```

The frontend reads API data from `NEXT_PUBLIC_API_BASE_URL`.

## Unit Tests

```bash
npm test
```
