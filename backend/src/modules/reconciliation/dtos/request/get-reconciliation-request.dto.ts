import { IsIn, IsOptional, IsString } from 'class-validator';

import { ReconcileStatus } from '../../database/schemas/reconciliation.schema';

const reconciliationStatuses: ReconcileStatus[] = [
  'matched',
  'refunded',
  'orphan',
  'unsettled',
];

export class GetReconciliationRequestDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(reconciliationStatuses)
  status?: ReconcileStatus;
}
