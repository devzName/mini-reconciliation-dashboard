import { CheckCircle2, Search } from "lucide-react";

import { formatDate, formatVnd } from "../lib/format";
import type {
  ReconciliationItem,
  ReconciliationStatusCounts,
  StatusFilter
} from "../types/reconciliation";
import { StatusFilterMenu } from "./StatusFilterMenu";

type ReconciliationTableProps = {
  counts: ReconciliationStatusCounts;
  isFilterOpen: boolean;
  isLoading: boolean;
  onFilterOpenChange: (isOpen: boolean) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  rows: ReconciliationItem[];
  searchQuery: string;
  statusFilter: StatusFilter;
  tableError: string;
  totalRows: number;
};

const statusLabel = {
  matched: "Matched",
  refunded: "Refunded",
  orphan: "Orphan",
  unsettled: "Unsettled"
};

const statusClass = {
  matched: "statusMatched",
  refunded: "statusRefunded",
  orphan: "statusOrphan",
  unsettled: "statusUnsettled"
};

const statusDescription = {
  matched: "Completed order with payment and no refund",
  refunded: "Completed order with payment and refund",
  orphan: "Payment row without a matching order",
  unsettled: "Order exists but has no payment"
};

export function ReconciliationTable({
  counts,
  isFilterOpen,
  isLoading,
  onFilterOpenChange,
  onSearchChange,
  onStatusChange,
  rows,
  searchQuery,
  statusFilter,
  tableError,
  totalRows
}: ReconciliationTableProps) {
  return (
    <>
      <div className="panelHeader">
        <div>
          <h2>Reconciliation results</h2>
          <p>
            {totalRows} rows sorted by order code
            {isLoading ? " - Loading" : ""}
          </p>
        </div>
        <label className="searchBox">
          <Search size={17} aria-hidden />
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search order code"
            value={searchQuery}
          />
        </label>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Order code</th>
              <th>Platform</th>
              <th>Order status</th>
              <th>Order date</th>
              <th>Settlement date</th>
              <th>Gross</th>
              <th>Refund</th>
              <th>Fees</th>
              <th>Net</th>
              <th>
                <label className="tableFilterHeader">
                  <span>Reconcile status</span>
                  <StatusFilterMenu
                    counts={counts}
                    isOpen={isFilterOpen}
                    onOpenChange={onFilterOpenChange}
                    onStatusChange={onStatusChange}
                    value={statusFilter}
                  />
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={`${item.orderCode}-${item.reconcileStatus}-${index}`}>
                <td className="strongCell">{item.orderCode}</td>
                <td>{item.platform ?? "-"}</td>
                <td>{item.orderStatus ?? "-"}</td>
                <td>{formatDate(item.orderDate)}</td>
                <td>{formatDate(item.settlementDate)}</td>
                <td>{formatVnd(item.grossRevenue)}</td>
                <td>{formatVnd(item.refundAmount)}</td>
                <td>{formatVnd(item.feeTotal)}</td>
                <td>{formatVnd(item.netReceived)}</td>
                <td>
                  <span
                    className={`status ${statusClass[item.reconcileStatus]}`}
                    title={statusDescription[item.reconcileStatus]}
                  >
                    {item.reconcileStatus === "matched" ? (
                      <CheckCircle2 size={14} aria-hidden />
                    ) : null}
                    {statusLabel[item.reconcileStatus]}
                  </span>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td className="emptyCell" colSpan={10}>
                  {tableError || "No reconciliation rows for this filter."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
