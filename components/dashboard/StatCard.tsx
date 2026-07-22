import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    value: string | number;
    change?: string;
    icon: LucideIcon;
    iconBg?: string;
}

export default function StatCard({
    title,
    value,
    change,
    icon: Icon,
    iconBg = "bg-blue-100",
}: Props) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>

                    {change && (
                        <p className="mt-3 text-sm font-medium text-green-600">
                            {change}
                        </p>
                    )}

                </div>

                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
                >
                    <Icon className="h-7 w-7 text-blue-700" />
                </div>

            </div>

        </div>
    );
}