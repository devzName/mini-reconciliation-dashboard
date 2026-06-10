import {
  CircleDollarSign,
  Percent,
  ReceiptText,
  RotateCcw,
  Rows3,
  WalletCards
} from "lucide-react";

import { formatVnd } from "../lib/format";
import type { Kpi } from "../types/reconciliation";

type KpiCardsProps = {
  kpi: Kpi;
};

export function KpiCards({ kpi }: KpiCardsProps) {
  const metrics = [
    {
      icon: CircleDollarSign,
      label: "Gross revenue",
      tone: "green",
      value: formatVnd(kpi.total_gross)
    },
    {
      icon: WalletCards,
      label: "Net received",
      tone: "blue",
      value: formatVnd(kpi.total_net)
    },
    {
      icon: ReceiptText,
      label: "Platform fees",
      tone: "amber",
      value: formatVnd(kpi.total_fees)
    },
    {
      icon: RotateCcw,
      label: "Refund total",
      tone: "red",
      value: formatVnd(kpi.refund_total)
    },
    {
      icon: Rows3,
      label: "Refund count",
      tone: "purple",
      value: String(kpi.refund_count)
    },
    {
      icon: Percent,
      label: "Reconciliation rate",
      tone: "blue",
      value: `${Math.round(kpi.reconciliation_rate * 10000) / 100}%`
    }
  ];

  return (
    <section className="metrics" aria-label="Reconciliation metrics">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <article className="metric" key={metric.label}>
            <div className={`metricIcon ${metric.tone}`}>
              <Icon size={20} aria-hidden />
            </div>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        );
      })}
    </section>
  );
}
