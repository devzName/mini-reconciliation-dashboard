import { Injectable } from '@nestjs/common';

import { query } from '../../../../database/pool';
import { Kpi, KpiRow } from '../schemas/kpi.schema';

@Injectable()
export class IncomeRepository {
  async getKpi(): Promise<Kpi> {
    const result = await query<KpiRow>(`
      WITH income_totals AS (
        SELECT
          COALESCE(SUM(gross_revenue), 0) AS total_gross,
          COALESCE(SUM(net_received), 0) AS total_net,
          COALESCE(SUM(fee_total), 0) AS total_fees,
          COUNT(*) FILTER (WHERE refund_amount < 0) AS refund_count,
          COALESCE(SUM(refund_amount) FILTER (WHERE refund_amount < 0), 0) AS refund_total
        FROM income
      ),
      order_totals AS (
        SELECT
          COUNT(*) AS total_orders,
          COUNT(DISTINCT o.order_code) FILTER (WHERE i.order_code IS NOT NULL) AS settled_orders
        FROM orders o
        LEFT JOIN income i ON i.order_code = o.order_code
      )
      SELECT
        income_totals.total_gross::text AS total_gross,
        income_totals.total_net::text AS total_net,
        income_totals.total_fees::text AS total_fees,
        CASE
          WHEN order_totals.total_orders = 0 THEN 0
          ELSE ROUND(
            order_totals.settled_orders::numeric / order_totals.total_orders::numeric,
            4
          )
        END::text AS reconciliation_rate,
        income_totals.refund_count::text AS refund_count,
        income_totals.refund_total::text AS refund_total
      FROM income_totals
      CROSS JOIN order_totals
    `);

    const [row] = result.rows;

    return {
      total_gross: Number(row.total_gross),
      total_net: Number(row.total_net),
      total_fees: Number(row.total_fees),
      reconciliation_rate: Number(row.reconciliation_rate),
      refund_count: Number(row.refund_count),
      refund_total: Number(row.refund_total),
    };
  }
}
