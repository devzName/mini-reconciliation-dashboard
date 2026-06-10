import { Dashboard } from "./page/dashboard";
import type {
  DashboardData,
  Kpi,
  ReconciliationResponse
} from "./types/reconciliation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

async function fetchDashboardData(): Promise<DashboardData> {
  const [kpiResponse, reconciliationResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/kpi`, { cache: "no-store" }),
    fetch(`${API_BASE_URL}/reconciliation?page=1&limit=25`, { cache: "no-store" })
  ]);

  if (!kpiResponse.ok || !reconciliationResponse.ok) {
    throw new Error("Unable to load reconciliation data");
  }

  const [kpi, reconciliation] = await Promise.all([
    kpiResponse.json() as Promise<Kpi>,
    reconciliationResponse.json() as Promise<ReconciliationResponse>
  ]);

  return { kpi, reconciliation };
}

export default async function Home() {
  let data: DashboardData | null = null;
  let errorMessage = "";

  try {
    data = await fetchDashboardData();
  } catch {
    errorMessage = `Unable to load data from ${API_BASE_URL}. Check that the backend is running.`;
  }

  return (
    <Dashboard
      errorMessage={errorMessage}
      apiBaseUrl={API_BASE_URL}
      kpi={
        data?.kpi ?? {
          reconciliation_rate: 0,
          refund_count: 0,
          refund_total: 0,
          total_fees: 0,
          total_gross: 0,
          total_net: 0
        }
      }
      reconciliation={
        data?.reconciliation ?? {
          items: [],
          meta: {
            limit: 25,
            page: 1,
            total: 0,
            totalPages: 0
          },
          statusCounts: {
            all: 0,
            matched: 0,
            orphan: 0,
            refunded: 0,
            unsettled: 0
          }
        }
      }
    />
  );
}
