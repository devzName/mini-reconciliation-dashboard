import { QueryResultRow } from 'pg';

export interface Income {
  id: number;
  orderCode: string;
  settlementDate: Date;
  grossRevenue: number;
  refundAmount: number;
  feeTotal: number;
  netReceived: number;
}

export interface IncomeRow extends QueryResultRow {
  id: number | string;
  order_code: string;
  settlement_date: Date;
  gross_revenue: number | string;
  refund_amount: number | string;
  fee_total: number | string;
  net_received: number | string;
}
