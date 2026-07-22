import { ShipmentStatus } from "@/models/Shipment";

interface Props {
  status: ShipmentStatus;
}

const styles: Record<ShipmentStatus, string> = {
  CREATED: "bg-gray-100 text-gray-700",

  READY_FOR_PICKUP: "bg-yellow-100 text-yellow-700",

  COLLECTED: "bg-blue-100 text-blue-700",

  WAREHOUSE_RECEIVED: "bg-indigo-100 text-indigo-700",

  CONSOLIDATED: "bg-purple-100 text-purple-700",

  EXPORT_CLEARANCE: "bg-orange-100 text-orange-700",

  IN_TRANSIT: "bg-cyan-100 text-cyan-700",

  ARRIVED_DESTINATION: "bg-sky-100 text-sky-700",

  CUSTOMS_CLEARANCE: "bg-pink-100 text-pink-700",

  IMPORT_WAREHOUSE: "bg-violet-100 text-violet-700",

  OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700",

  DELIVERED: "bg-green-100 text-green-700",

  CANCELLED: "bg-red-100 text-red-700",
};

export default function ShipmentStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}