import { KpiRow } from '../../interfaces/kpi.interface';

export class KpiDto {
  total_gross!: number;
  total_net!: number;
  total_fees!: number;
  reconciliation_rate!: number;
  refund_count!: number;
  refund_total!: number;

  constructor(row: KpiRow) {
    this.total_gross = Number(row.total_gross);
    this.total_net = Number(row.total_net);
    this.total_fees = Number(row.total_fees);
    this.reconciliation_rate = Number(row.reconciliation_rate);
    this.refund_count = Number(row.refund_count);
    this.refund_total = Number(row.refund_total);
  }
}



