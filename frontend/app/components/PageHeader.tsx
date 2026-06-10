import { PanelLeft } from "lucide-react";

type PageHeaderProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export function PageHeader({
  isSidebarOpen,
  onToggleSidebar
}: PageHeaderProps) {
  return (
    <header className="topbar">
      <button
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        className="sidebarToggle"
        onClick={onToggleSidebar}
        type="button"
      >
        <PanelLeft size={20} aria-hidden />
      </button>
      <div>
        <p className="eyebrow">Marketplace payout cycle</p>
        <h1>Order and income reconciliation</h1>
      </div>
    </header>
  );
}
