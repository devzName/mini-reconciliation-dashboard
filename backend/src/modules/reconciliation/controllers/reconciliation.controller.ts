import { Controller, Get, Query } from '@nestjs/common';

import { Kpi } from '../database/schemas/kpi.schema';
import { ReconciliationResponse } from '../database/schemas/reconciliation.schema';
import { ReconciliationService } from '../services/reconciliation.service';

@Controller()
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Get('reconciliation')
  getReconciliation(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('q') search?: string,
    @Query('status') status?: string,
  ): Promise<ReconciliationResponse> {
    return this.reconciliationService.getReconciliation({
      limit,
      page,
      search,
      status,
    });
  }

  @Get('kpi')
  getKpi(): Promise<Kpi> {
    return this.reconciliationService.getKpi();
  }
}
