# Backend Agent Notes

## Overview

NestJS API for the Mini Reconciliation Dashboard. It imports marketplace
`orders.csv` and `income.csv`, stores them in PostgreSQL, and exposes KPI and
reconciliation APIs for the Next.js frontend.

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
    app.module.ts              # TypeORM PostgreSQL connection config
    common/
      dtos/
        page-options.dto.ts
    modules/
      reconciliation/
        controllers/
          reconciliation.controller.ts
        interfaces/
          kpi.interface.ts
          reconciliation.interface.ts
        database/
          repositories/
            income.repository.ts
            orders.repository.ts
          schemas/
            income.schema.ts
            order.schema.ts
        dtos/
          request/
            get-reconciliation-request.dto.ts
          response/
            kpi.dto.ts
            reconciliation.dto.ts
        services/
          reconciliation.service.ts
        reconciliation.module.ts
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
npm run dev         # starts NestJS in watch mode
npm run build
npm test
```

## API

```text
GET /api/kpi
GET /api/reconciliation?page=1&limit=25&status=matched&q=ORD
```

`GET /api/reconciliation` uses `GetReconciliationRequestDto` and supports:

- `page`
- `limit`
- `status=matched|refunded|orphan|unsettled`
- `q` for order code search

Default sort is `order_code ASC`.

## Database / TypeORM

- Nest runtime uses TypeORM with PostgreSQL via `TypeOrmModule.forRoot` in `src/app.module.ts`.
- `Order` and `Income` schemas are TypeORM entities with `@Entity`, `@Column`, and primary key decorators.
- `synchronize` is disabled; database shape is controlled by SQL migrations.
- Repositories use TypeORM `DataSource.query()` for the current reconciliation SQL because the API needs aggregate and full outer join queries.
- Migration/import/reset scripts still use standalone script DB helpers and are run outside Nest.

## DTO Rules

- Request DTOs live in `modules/reconciliation/dtos/request`.
- Response DTOs live in `modules/reconciliation/dtos/response`.
- Shared DTOs live in `src/common/dtos`.
- `PageOptionsDto` is the shared pagination base class.
- Repositories return DTO class instances, for example `new KpiDto(row)`.
- DTO constructors should own row-to-response mapping when the input is a DB row.

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
