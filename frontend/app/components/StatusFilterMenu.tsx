import { Filter } from "lucide-react";

import type {
  ReconciliationStatusCounts,
  StatusFilter
} from "../types/reconciliation";

type StatusFilterMenuProps = {
  counts: ReconciliationStatusCounts;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onStatusChange: (status: StatusFilter) => void;
  value: StatusFilter;
};

const filterOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Matched", value: "matched" },
  { label: "Refunded", value: "refunded" },
  { label: "Orphan", value: "orphan" },
  { label: "Unsettled", value: "unsettled" }
];

export function StatusFilterMenu({
  counts,
  isOpen,
  onOpenChange,
  onStatusChange,
  value
}: StatusFilterMenuProps) {
  return (
    <div
      className="statusFilterControl"
      title={`Filter: ${
        filterOptions.find((option) => option.value === value)?.label ?? "All"
      }`}
    >
      <button
        aria-expanded={isOpen}
        aria-label="Filter reconcile status"
        className="statusFilterButton"
        onClick={() => onOpenChange(!isOpen)}
        type="button"
      >
        <Filter size={14} aria-hidden />
      </button>
      {isOpen ? (
        <div className="statusFilterMenu" role="menu">
          {filterOptions.map((option) => (
            <button
              className={
                value === option.value
                  ? "statusFilterOption active"
                  : "statusFilterOption"
              }
              key={option.value}
              onClick={() => {
                onStatusChange(option.value);
                onOpenChange(false);
              }}
              role="menuitem"
              type="button"
            >
              <span>{option.label}</span>
              <strong>{counts[option.value]}</strong>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
