import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReconciliationController } from './controllers/reconciliation.controller';
import { IncomeRepository } from './database/repositories/income.repository';
import { OrdersRepository } from './database/repositories/orders.repository';
import { Income } from './database/schemas/income.schema';
import { Order } from './database/schemas/order.schema';
import { ReconciliationService } from './services/reconciliation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Income])],
  controllers: [ReconciliationController],
  providers: [OrdersRepository, IncomeRepository, ReconciliationService],
})
export class ReconciliationModule {}
