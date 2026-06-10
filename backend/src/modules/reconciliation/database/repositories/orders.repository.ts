import { Injectable } from '@nestjs/common';

import { query } from '../../../../database/pool';
import {
  ReconciliationItem,
  ReconciliationItemRow,
  ReconciliationQuery,
  ReconciliationResponse,
  ReconciliationStatusCountsRow,
  ReconciliationTotalRow,
} from '../schemas/reconciliation.schema';

@Injectable()
export class OrdersRepository {
  async getReconciliation(
    reconciliationQuery: ReconciliationQuery,
  ): Promise<ReconciliationResponse> {
    const baseCte = `
      WITH income_by_order AS (
        SELECT
          order_code,
          MIN(settlement_date) AS settlement_date,
          SUM(gross_revenue) AS gross_revenue,
          SUM(refund_amount) AS refund_amount,
          SUM(fee_total) AS fee_total,
          SUM(net_received) AS net_received,
          COUNT(*) AS payment_count
        FROM income
        GROUP BY order_code
      ),
      reconciliation_rows AS (
        SELECT
          COALESCE(o.order_code, i.order_code) AS order_code,
          o.platform,
          o.status AS order_status,
          o.product_price,
          o.order_date,
          i.settlement_date,
          COALESCE(i.gross_revenue, 0)::text AS gross_revenue,
          COALESCE(i.refund_amount, 0)::text AS refund_amount,
          COALESCE(i.fee_total, 0)::text AS fee_total,
          COALESCE(i.net_received, 0)::text AS net_received,
          CASE
            WHEN o.order_code IS NULL THEN 'orphan'
            WHEN COALESCE(i.payment_count, 0) = 0 THEN 'unsettled'
            WHEN COALESCE(i.refund_amount, 0) < 0 THEN 'refunded'
            ELSE 'matched'
          END AS reconcile_status
        FROM orders o
        FULL OUTER JOIN income_by_order i ON i.order_code = o.order_code
      )
    `;
    const status = reconciliationQuery.status ?? null;
    const search = reconciliationQuery.search ?? null;
    const offset = (reconciliationQuery.page - 1) * reconciliationQuery.limit;

    const [rowsResult, totalResult, countsResult] = await Promise.all([
      query<ReconciliationItemRow>(
        `
          ${baseCte}
          SELECT *
          FROM reconciliation_rows
          WHERE
            ($1::text IS NULL OR reconcile_status = $1)
            AND ($2::text IS NULL OR order_code ILIKE '%' || $2 || '%')
          ORDER BY order_code ASC
          LIMIT $3
          OFFSET $4
        `,
        [status, search, reconciliationQuery.limit, offset],
      ),
      query<ReconciliationTotalRow>(
        `
          ${baseCte}
          SELECT COUNT(*)::text AS total
          FROM reconciliation_rows
          WHERE
            ($1::text IS NULL OR reconcile_status = $1)
            AND ($2::text IS NULL OR order_code ILIKE '%' || $2 || '%')
        `,
        [status, search],
      ),
      query<ReconciliationStatusCountsRow>(
        `
          ${baseCte}
          SELECT
            COUNT(*)::text AS all_count,
            COUNT(*) FILTER (WHERE reconcile_status = 'matched')::text AS matched_count,
            COUNT(*) FILTER (WHERE reconcile_status = 'refunded')::text AS refunded_count,
            COUNT(*) FILTER (WHERE reconcile_status = 'orphan')::text AS orphan_count,
            COUNT(*) FILTER (WHERE reconcile_status = 'unsettled')::text AS unsettled_count
          FROM reconciliation_rows
          WHERE ($1::text IS NULL OR order_code ILIKE '%' || $1 || '%')
        `,
        [search],
      ),
    ]);

    const total = Number(totalResult.rows[0].total);
    const counts = countsResult.rows[0];

    return {
      items: rowsResult.rows.map((row) => this.mapRow(row)),
      meta: {
        limit: reconciliationQuery.limit,
        page: reconciliationQuery.page,
        total,
        totalPages: Math.ceil(total / reconciliationQuery.limit),
      },
      statusCounts: {
        all: Number(counts.all_count),
        matched: Number(counts.matched_count),
        orphan: Number(counts.orphan_count),
        refunded: Number(counts.refunded_count),
        unsettled: Number(counts.unsettled_count),
      },
    };
  }

  private mapRow(row: ReconciliationItemRow): ReconciliationItem {
    return {
      orderCode: row.order_code,
      platform: row.platform,
      orderStatus: row.order_status,
      productPrice:
        row.product_price === null ? null : Number(row.product_price),
      orderDate: row.order_date,
      settlementDate: row.settlement_date,
      grossRevenue: Number(row.gross_revenue),
      refundAmount: Number(row.refund_amount),
      feeTotal: Number(row.fee_total),
      netReceived: Number(row.net_received),
      reconcileStatus: row.reconcile_status,
    };
  }
}
