import { ReactNode } from "react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function DashboardHeader({
  title = "How is it going?",
  subtitle = "Monitor all shipments, customs clearance and deliveries.",
  action,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={`mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center ${className || ""}`}
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
      </div>

      {(action || children) && (
        <div className="flex items-center gap-3">
          {action}
          {children}
        </div>
      )}
    </div>
  );
}