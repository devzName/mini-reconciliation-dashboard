import type { ReconciliationResponse } from "../types/reconciliation";

type PaginationProps = {
  isLoading: boolean;
  meta: ReconciliationResponse["meta"];
  onPageChange: (page: number) => void;
};

export function Pagination({ isLoading, meta, onPageChange }: PaginationProps) {
  return (
    <div className="paginationBar">
      <span>
        Page {meta.totalPages ? meta.page : 0} of {meta.totalPages}
      </span>
      <div>
        <button
          disabled={meta.page <= 1 || isLoading}
          onClick={() => onPageChange(Math.max(meta.page - 1, 1))}
          type="button"
        >
          Previous
        </button>
        <button
          disabled={meta.page >= meta.totalPages || isLoading}
          onClick={() => onPageChange(Math.min(meta.page + 1, meta.totalPages))}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
