import { ArrowDownUp, X } from "lucide-react";

type SidebarProps = {
  onClose: () => void;
};

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebarHeader">
        <div className="brand">
          <ArrowDownUp size={22} aria-hidden />
          <span>Recon Mini</span>
        </div>
        <button
          aria-label="Close sidebar"
          className="sidebarClose"
          onClick={onClose}
          type="button"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
      <nav className="nav">
        <a className="active" href="#">
          Dashboard
        </a>
      </nav>
    </aside>
  );
}
