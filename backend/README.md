# Mini Reconciliation Backend

NestJS backend server for the Mini Reconciliation Dashboard.

## Requirements

Recommended local versions:

```bash
node -v  # v24.16.0
npm -v   # 11.13.0
```

Node.js `20.x` or newer is recommended for this NestJS/TypeScript setup.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

The server listens on `PORT` when provided, otherwise `8080`.

Available endpoints:

```bash
GET /api/reconciliation
GET /api/kpi
```

## Unit Tests

```bash
npm test
```

## PostgreSQL

Create a `.env` file with:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mini_reconciliation
```

Run migration. This creates the `mini_reconciliation` database if it does not
exist, then creates the tables:

```bash
npm run db:migrate
```

Import `orders.csv` and `income.csv` from `scripts/data`:

```bash
npm run db:import
```

Reset database tables when you want to run migrations from the beginning:

```bash
npm run db:reset
npm run db:migrate
npm run db:import
```
