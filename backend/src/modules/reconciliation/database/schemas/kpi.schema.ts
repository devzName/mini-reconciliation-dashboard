import { QueryResultRow } from 'pg';

export interface Kpi {
  total_gross: number;
  total_net: number;
  total_fees: number;
  reconciliation_rate: number;
  refund_count: number;
  refund_total: number;
}

export interface KpiRow extends QueryResultRow {
  total_gross: number | string;
  total_net: number | string;
  total_fees: number | string;
  reconciliation_rate: number | string;
  refund_count: number | string;
  refund_total: number | string;
}
