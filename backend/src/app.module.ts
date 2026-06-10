import 'dotenv/config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
    ReconciliationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
