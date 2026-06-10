import { Injectable } from '@nestjs/common';

import { IncomeRepository } from '../database/repositories/income.repository';
import { OrdersRepository } from '../database/repositories/orders.repository';
import { GetReconciliationRequestDto } from '../dtos/request/get-reconciliation-request.dto';
import { KpiDto } from '../dtos/response/kpi.dto';
import {
  ReconcileStatus,
  ReconciliationQuery,
} from '../database/schemas/reconciliation.schema';
import { ReconciliationDto } from '../dtos/response/reconciliation.dto';

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
    rawQuery: GetReconciliationRequestDto,
  ): Promise<ReconciliationDto> {
    return this.ordersRepository.getReconciliation(
      this.normalizeQuery(rawQuery),
    );
  }

  getKpi(): Promise<KpiDto> {
    return this.incomeRepository.getKpi();
  }

  private normalizeQuery(
    rawQuery: GetReconciliationRequestDto,
  ): ReconciliationQuery {
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
    const search = rawQuery.q?.trim() || undefined;

    return { limit, page, search, status };
  }
}
