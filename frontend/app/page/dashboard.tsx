"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { KpiCards } from "../components/KpiCards";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";
import { ReconciliationTable } from "../components/ReconciliationTable";
import { Sidebar } from "../components/Sidebar";
import type {
  Kpi,
  ReconciliationResponse,
  StatusFilter
} from "../types/reconciliation";

type DashboardProps = {
  apiBaseUrl: string;
  errorMessage: string;
  kpi: Kpi;
  reconciliation: ReconciliationResponse;
};

const PAGE_LIMIT = 25;

export function Dashboard({
  apiBaseUrl,
  errorMessage,
  kpi,
  reconciliation
}: DashboardProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(reconciliation.meta.page);
  const [reconciliationData, setReconciliationData] = useState(reconciliation);
  const [tableError, setTableError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      limit: String(PAGE_LIMIT),
      page: String(currentPage)
    });

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    if (debouncedSearchQuery.trim()) {
      params.set("q", debouncedSearchQuery.trim());
    }

    setIsLoading(true);
    setTableError("");

    fetch(`${apiBaseUrl}/reconciliation?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load reconciliation rows");
        }

        return response.json() as Promise<ReconciliationResponse>;
      })
      .then((nextData) => {
        setReconciliationData(nextData);
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setTableError("Unable to load table data from the backend.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [apiBaseUrl, currentPage, debouncedSearchQuery, statusFilter]);

  const counts = reconciliationData.statusCounts;
  const rows = reconciliationData.items;
  const meta = reconciliationData.meta;

  return (
    <main className={isSidebarOpen ? "shell sidebarOpen" : "shell"}>
      <button
        aria-label="Close sidebar overlay"
        className="sidebarBackdrop"
        onClick={() => setIsSidebarOpen(false)}
        type="button"
      />
      <Sidebar onClose={() => setIsSidebarOpen(false)} />

      <section className="workspace">
        <PageHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />

        {errorMessage ? (
          <section className="notice" role="alert">
            <AlertTriangle size={20} aria-hidden />
            <span>{errorMessage}</span>
          </section>
        ) : null}

        <KpiCards kpi={kpi} />

        <section className="contentGrid">
          <div className="mainPanel">
            <ReconciliationTable
              counts={counts}
              isFilterOpen={isStatusMenuOpen}
              isLoading={isLoading}
              onFilterOpenChange={setIsStatusMenuOpen}
              onSearchChange={(value) => {
                setSearchQuery(value);
              }}
              onStatusChange={(status) => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              rows={rows}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              tableError={tableError}
              totalRows={meta.total}
            />

            <Pagination
              isLoading={isLoading}
              meta={meta}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
