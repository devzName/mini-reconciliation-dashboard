# Backend Agent Notes

## Overview

NestJS API for the Mini Reconciliation Dashboard. It imports marketplace
`orders.csv` and `income.csv`, stores them in PostgreSQL, and exposes KPI and
reconciliation APIs.

## Structure

```text
backend/
  migrations/
    001_create_orders_and_income.sql
  scripts/
    data/
      orders.csv
      income.csv
    db.ts
    import-excel.ts
    migrate.ts
    reset-db.ts
  src/
    database/
      pool.ts
    modules/
      reconciliation/
        controllers/
        database/
          repositories/
          schemas/
        services/
```

## Setup

```bash
npm install
```

Create `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mini_reconciliation
```

## Commands

```bash
npm run db:migrate  # creates database if missing, then creates tables
npm run db:import   # imports scripts/data/orders.csv and income.csv
npm run db:reset    # drops orders, income, schema_migrations
npm run start:dev
npm run build
```

## API

```text
GET /api/kpi
GET /api/reconciliation?page=1&limit=25&status=matched&q=ORD
```

`GET /api/reconciliation` supports:

- `page`
- `limit`
- `status=matched|refunded|orphan|unsettled`
- `q` for order code search

Default sort is `order_code ASC`.

## Reconciliation Rules

- `matched`: order exists, has payment, refund amount is not negative.
- `refunded`: order exists, has payment, `refund_amount < 0`.
- `orphan`: income row exists but matching order does not exist.
- `unsettled`: order exists but no income row exists.

Money is VND and has no decimals. Store money as PostgreSQL `INTEGER`, not
float.

DB constraint:

```sql
net_received = gross_revenue + refund_amount + fee_total
```

## Important Data Rules

- `income.order_code` is `UNIQUE`.
- Duplicate income rows are ignored after the first one via
  `ON CONFLICT (order_code) DO NOTHING`.
- Do not add a foreign key from `income.order_code` to `orders.order_code`;
  orphan payouts are a valid reconciliation case.
