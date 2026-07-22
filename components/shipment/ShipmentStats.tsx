import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

export default function ShipmentStats({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <Icon className="text-blue-600" size={30} />
      </div>
    </div>
  );
}