import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  changeColor?: string;
  color?: "blue" | "green" | "red" | "yellow" | "orange" | "purple" | "pink" | "indigo";
}

const colorStyles = {
  blue: { bg: "bg-blue-100", icon: "text-blue-700", change: "text-blue-600" },
  green: { bg: "bg-green-100", icon: "text-green-700", change: "text-green-600" },
  red: { bg: "bg-red-100", icon: "text-red-700", change: "text-red-600" },
  yellow: { bg: "bg-yellow-100", icon: "text-yellow-700", change: "text-yellow-600" },
  orange: { bg: "bg-orange-100", icon: "text-orange-700", change: "text-orange-600" },
  purple: { bg: "bg-purple-100", icon: "text-purple-700", change: "text-purple-600" },
  pink: { bg: "bg-pink-100", icon: "text-pink-700", change: "text-pink-600" },
  indigo: { bg: "bg-indigo-100", icon: "text-indigo-700", change: "text-indigo-600" },
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  changeColor,
  color = "blue",
}: Props) {
  const styles = colorStyles[color];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
          {change && (
            <p className={`mt-3 text-sm font-medium ${changeColor || styles.change}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg || styles.bg}`}>
          <Icon className={`h-7 w-7 ${iconColor || styles.icon}`} />
        </div>
      </div>
    </div>
  );
}