export type ReconcileStatus = 'matched' | 'refunded' | 'orphan' | 'unsettled';

export interface ReconciliationQuery {
  limit: number;
  page: number;
  search?: string;
  status?: ReconcileStatus;
}

export interface ReconciliationItemRow {
  order_code: string;
  platform: string | null;
  order_status: 'completed' | 'cancelled' | null;
  product_price: number | string | null;
  order_date: Date | null;
  settlement_date: Date | null;
  gross_revenue: number | string;
  refund_amount: number | string;
  fee_total: number | string;
  net_received: number | string;
  reconcile_status: ReconcileStatus;
}

export interface ReconciliationTotalRow {
  total: number | string;
}

export interface ReconciliationStatusCountsRow {
  all_count: number | string;
  matched_count: number | string;
  refunded_count: number | string;
  orphan_count: number | string;
  unsettled_count: number | string;
}
