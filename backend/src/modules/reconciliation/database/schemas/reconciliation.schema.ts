import { QueryResultRow } from 'pg';

export type ReconcileStatus = 'matched' | 'refunded' | 'orphan' | 'unsettled';

export interface ReconciliationItem {
  orderCode: string;
  platform: string | null;
  orderStatus: 'completed' | 'cancelled' | null;
  productPrice: number | null;
  orderDate: Date | null;
  settlementDate: Date | null;
  grossRevenue: number;
  refundAmount: number;
  feeTotal: number;
  netReceived: number;
  reconcileStatus: ReconcileStatus;
}

export interface ReconciliationStatusCounts {
  all: number;
  matched: number;
  refunded: number;
  orphan: number;
  unsettled: number;
}

export interface ReconciliationPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReconciliationResponse {
  items: ReconciliationItem[];
  meta: ReconciliationPaginationMeta;
  statusCounts: ReconciliationStatusCounts;
}

export interface ReconciliationQuery {
  limit: number;
  page: number;
  search?: string;
  status?: ReconcileStatus;
}

export interface ReconciliationItemRow extends QueryResultRow {
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

export interface ReconciliationTotalRow extends QueryResultRow {
  total: number | string;
}

export interface ReconciliationStatusCountsRow extends QueryResultRow {
  all_count: number | string;
  matched_count: number | string;
  refunded_count: number | string;
  orphan_count: number | string;
  unsettled_count: number | string;
}
