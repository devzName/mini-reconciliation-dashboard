export type ReconcileStatus = "matched" | "refunded" | "orphan" | "unsettled";

export type StatusFilter = "all" | ReconcileStatus;

export type ReconciliationItem = {
  orderCode: string;
  platform: string | null;
  orderStatus: "completed" | "cancelled" | null;
  productPrice: number | null;
  orderDate: string | null;
  settlementDate: string | null;
  grossRevenue: number;
  refundAmount: number;
  feeTotal: number;
  netReceived: number;
  reconcileStatus: ReconcileStatus;
};

export type Kpi = {
  total_gross: number;
  total_net: number;
  total_fees: number;
  reconciliation_rate: number;
  refund_count: number;
  refund_total: number;
};

export type ReconciliationStatusCounts = Record<StatusFilter, number>;

export type ReconciliationResponse = {
  items: ReconciliationItem[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  statusCounts: ReconciliationStatusCounts;
};

export type DashboardData = {
  kpi: Kpi;
  reconciliation: ReconciliationResponse;
};
