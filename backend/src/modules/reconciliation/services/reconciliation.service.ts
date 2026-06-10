import { Injectable } from '@nestjs/common';

import { IncomeRepository } from '../database/repositories/income.repository';
import { OrdersRepository } from '../database/repositories/orders.repository';
import { Kpi } from '../database/schemas/kpi.schema';
import {
  ReconcileStatus,
  ReconciliationQuery,
  ReconciliationResponse,
} from '../database/schemas/reconciliation.schema';

type RawReconciliationQuery = {
  limit?: string;
  page?: string;
  search?: string;
  status?: string;
};

const reconciliationStatuses: ReconcileStatus[] = [
  'matched',
  'refunded',
  'orphan',
  'unsettled',
];

@Injectable()
export class ReconciliationService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly incomeRepository: IncomeRepository,
  ) {}

  getReconciliation(
    rawQuery: RawReconciliationQuery,
  ): Promise<ReconciliationResponse> {
    return this.ordersRepository.getReconciliation(
      this.normalizeQuery(rawQuery),
    );
  }

  getKpi(): Promise<Kpi> {
    return this.incomeRepository.getKpi();
  }

  private normalizeQuery(rawQuery: RawReconciliationQuery): ReconciliationQuery {
    const page = Math.max(Number(rawQuery.page ?? 1) || 1, 1);
    const limit = Math.min(
      Math.max(Number(rawQuery.limit ?? 10) || 10, 1),
      100,
    );
    const status = reconciliationStatuses.includes(
      rawQuery.status as ReconcileStatus,
    )
      ? (rawQuery.status as ReconcileStatus)
      : undefined;
    const search = rawQuery.search?.trim() || undefined;

    return { limit, page, search, status };
  }
}
