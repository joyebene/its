import Link from "next/link";
import Button from "@/components/shared/Button";
import ShipmentTimeline from "@/components/shipment/ShipmentTimeline";
import ShipmentInfo from "@/components/shipment/ShipmentInfo";

import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ShipmentDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  await connectDB();

  const shipment = await Shipment.findById(id)
    .populate("product")
    .lean();

  if (!shipment) {
    return (
      <div className="p-10 text-center">
        Shipment not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Shipment Details
          </h1>

          <p className="text-gray-500">
            {shipment.shipmentNumber}
          </p>
        </div>

        <Link href={`/shipments/${shipment._id}/edit`}>
          <Button>Edit Shipment</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 lg:col-span-2">
          <h2 className="mb-6 font-semibold">
            Shipment Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <ShipmentInfo
              label="Shipment Number"
              value={shipment.shipmentNumber}
            />

            <ShipmentInfo
              label="Tracking Number"
              value={shipment.trackingNumber}
            />

            <ShipmentInfo
              label="Carrier"
              value={shipment.carrier || "-"}
            />

            <ShipmentInfo
              label="Shipping Method"
              value={shipment.shippingMethod}
            />

            <ShipmentInfo
              label="Status"
              value={shipment.status}
            />

            <ShipmentInfo
              label="Origin"
              value={`${shipment.origin.city}, ${shipment.origin.state}, ${shipment.origin.country}`}
            />

            <ShipmentInfo
              label="Destination"
              value={`${shipment.destination.city}, ${shipment.destination.state}, ${shipment.destination.country}`}
            />

            <ShipmentInfo
              label="Estimated Departure"
              value={
                shipment.estimatedDeparture
                  ? new Date(
                      shipment.estimatedDeparture
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <ShipmentInfo
              label="Estimated Arrival"
              value={
                shipment.estimatedArrival
                  ? new Date(
                      shipment.estimatedArrival
                    ).toLocaleDateString()
                  : "-"
              }
            />
          </div>
        </div>

        <ShipmentTimeline
          currentStatus={shipment.status}
        />
      </div>
    </div>
  );
}