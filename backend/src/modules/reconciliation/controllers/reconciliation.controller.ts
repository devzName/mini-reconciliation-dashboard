import { Controller, Get, Query } from '@nestjs/common';

import { GetReconciliationRequestDto } from '../dtos/request/get-reconciliation-request.dto';
import { KpiDto } from '../dtos/response/kpi.dto';
import { ReconciliationDto } from '../dtos/response/reconciliation.dto';
import { ReconciliationService } from '../services/reconciliation.service';

@Controller()
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Get('reconciliation')
  getReconciliation(
    @Query() query: GetReconciliationRequestDto,
  ): Promise<ReconciliationDto> {
    return this.reconciliationService.getReconciliation(query);
  }

  @Get('kpi')
  getKpi(): Promise<KpiDto> {
    return this.reconciliationService.getKpi();
  }
}
