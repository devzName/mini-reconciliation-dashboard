# Frontend Agent Notes

## Overview

Next.js dashboard UI for the Mini Reconciliation Dashboard. It calls the backend
KPI and reconciliation APIs and renders KPI cards, searchable/paginated table,
status filter, and collapsible sidebar.

## Structure

```text
frontend/
  app/
    components/
      KpiCards.tsx
      PageHeader.tsx
      Pagination.tsx
      ReconciliationTable.tsx
      Sidebar.tsx
      StatusFilterMenu.tsx
    lib/
      format.ts
    page/
      dashboard.tsx
    types/
      reconciliation.ts
    page.tsx
    globals.css
```

## Setup

```bash
npm install
```

Create `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Commands

```bash
npm run dev
npm run build
```

Frontend runs at:

```text
http://localhost:3000
```

## API Usage

The frontend calls:

```text
GET /kpi
GET /reconciliation?page=1&limit=25&status=matched&q=ORD
```

All filtering, search, sorting, and pagination are API-driven. Do not add local
array filtering for the main reconciliation table.

## Conventions

- Component files use PascalCase, for example `KpiCards.tsx`.
- Shared data types live in `app/types/reconciliation.ts`.
- Formatting helpers live in `app/lib/format.ts`.
- Main client dashboard is `app/page/dashboard.tsx`.
- Search is debounced in `app/page/dashboard.tsx` with 500ms delay.
- Money is displayed as VND using `formatVnd`.
