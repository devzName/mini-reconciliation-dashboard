import { PageOptionsDto } from '../../../../common/dtos/page-options.dto';
import {
  ReconcileStatus,
  ReconciliationItemRow,
  ReconciliationStatusCountsRow,
} from '../../database/schemas/reconciliation.schema';

export class ReconciliationItemDto {
  orderCode!: string;
  platform!: string | null;
  orderStatus!: 'completed' | 'cancelled' | null;
  productPrice!: number | null;
  orderDate!: Date | null;
  settlementDate!: Date | null;
  grossRevenue!: number;
  refundAmount!: number;
  feeTotal!: number;
  netReceived!: number;
  reconcileStatus!: ReconcileStatus;

  constructor(row: ReconciliationItemRow) {
    this.orderCode = row.order_code;
    this.platform = row.platform;
    this.orderStatus = row.order_status;
    this.productPrice =
      row.product_price === null ? null : Number(row.product_price);
    this.orderDate = row.order_date;
    this.settlementDate = row.settlement_date;
    this.grossRevenue = Number(row.gross_revenue);
    this.refundAmount = Number(row.refund_amount);
    this.feeTotal = Number(row.fee_total);
    this.netReceived = Number(row.net_received);
    this.reconcileStatus = row.reconcile_status;
  }
}

export class ReconciliationStatusCountsDto {
  all!: number;
  matched!: number;
  refunded!: number;
  orphan!: number;
  unsettled!: number;

  constructor(row: ReconciliationStatusCountsRow) {
    this.all = Number(row.all_count);
    this.matched = Number(row.matched_count);
    this.refunded = Number(row.refunded_count);
    this.orphan = Number(row.orphan_count);
    this.unsettled = Number(row.unsettled_count);
  }
}

export class ReconciliationPaginationDto extends PageOptionsDto {
  constructor(data: { page: number; limit: number; total: number }) {
    super(data);
  }
}

export class ReconciliationDto {
  items!: ReconciliationItemDto[];
  meta!: ReconciliationPaginationDto;
  statusCounts!: ReconciliationStatusCountsDto;

  constructor(data: ReconciliationDto) {
    Object.assign(this, data);
  }
}


