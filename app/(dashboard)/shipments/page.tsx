import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle,
  Plus,
} from "lucide-react";
import ShipmentStats from "@/components/shipment/ShipmentStats";
import Button from "@/components/shared/Button";

import DataTable from "@/components/shared/DataTable";
import ShipmentStatusBadge from "@/components/shipment/ShipmentStatusBadge";
import { IShipment } from "@/lib/types";


const columns = [
  {
    key: "shipmentNumber",
    title: "Shipment",
  },
  {
    key: "trackingNumber",
    title: "Tracking",
  },
  {
    key: "carrier",
    title: "Carrier",
  },
  {
    key: "shippingMethod",
    title: "Method",
  },
  {
    key: "status",
    title: "Status",
    render: (shipment: IShipment) => (
      <ShipmentStatusBadge status={shipment.status} />
    ),
  },
  {
    key: "estimatedArrival",
    title: "ETA",
    render: (shipment: IShipment) =>
      shipment.estimatedArrival
        ? new Date(
          shipment.estimatedArrival
        ).toLocaleDateString()
        : "-",
  },
];

export default async function ShipmentsPage() {
  // TODO:
  // Replace with database query
  const shipments = [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Shipments
          </h1>

          <p className="text-gray-500">
            Manage all shipments
          </p>
        </div>

        <Link href="/shipments/create">
          <Button className="flex items-center px-2 sm:px-3 md:px-4 gap-2">
            <Plus size={18} />
            Create Shipment
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <ShipmentStats
          title="Total Shipments"
          value={0}
          icon={Package}
        />

        <ShipmentStats
          title="In Transit"
          value={0}
          icon={Truck}
        />

        <ShipmentStats
          title="Delivered"
          value={0}
          icon={CheckCircle}
        />
      </div>

      <DataTable
        columns={columns}
        data={shipments}
        resource="shipments"
      />
    </div>
  );
}