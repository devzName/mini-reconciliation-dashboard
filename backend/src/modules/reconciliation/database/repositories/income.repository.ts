import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KpiDto } from '../../dtos/response/kpi.dto';
import { KpiRow } from '../../interfaces/kpi.interface';
import { Income } from '../schemas/income.schema';

@Injectable()
export class IncomeRepository {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async getKpi(): Promise<KpiDto> {
    const rows = await this.incomeRepository.query<KpiRow[]>(`
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

    const [row] = rows;

    return new KpiDto(row);
  }
}

