import { Module } from '@nestjs/common';

import { ReconciliationController } from './controllers/reconciliation.controller';
import { IncomeRepository } from './database/repositories/income.repository';
import { OrdersRepository } from './database/repositories/orders.repository';
import { ReconciliationService } from './services/reconciliation.service';

@Module({
  imports: [],
  controllers: [ReconciliationController],
  providers: [OrdersRepository, IncomeRepository, ReconciliationService],
})
export class ReconciliationModule {}
