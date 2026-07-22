import Link from "next/link";
import Button from "@/components/shared/Button";
import ShipmentTimeline from "@/components/shipment/ShipmentTimeline";
import ShipmentInfo from "@/components/shipment/ShipmentInfo";
import { ShipmentStatus } from "@/models/Shipment";

export default function ShipmentDetailsPage() {

    const shipment = {

        shipmentNumber: "SHP-001",

        trackingNumber: "TRK938483",

        carrier: "Maersk",

        containerNumber: "MSKU-22333",

        shippingMethod: "SEA",

        originWarehouse: "Lagos Warehouse",

        destinationWarehouse: "Abuja Warehouse",

        estimatedDeparture: "20 Jul 2026",

        estimatedArrival: "30 Jul 2026",

        status: ShipmentStatus.IN_TRANSIT,

    };

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

                <Link
                    href={`/shipments/${1}/edit`}
                >

                    <Button className="px-2 sm:px-4">

                        Edit Shipment

                    </Button>

                </Link>

            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 rounded-xl border bg-white p-6">

                    <h2 className="font-semibold mb-6">

                        Shipment Information

                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

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

                            value={shipment.carrier}

                        />

                        <ShipmentInfo

                            label="Container"

                            value={shipment.containerNumber}

                        />

                        <ShipmentInfo

                            label="Method"

                            value={shipment.shippingMethod}

                        />

                        <ShipmentInfo

                            label="Origin"

                            value={shipment.originWarehouse}

                        />

                        <ShipmentInfo

                            label="Destination"

                            value={shipment.destinationWarehouse}

                        />

                        <ShipmentInfo

                            label="ETA"

                            value={shipment.estimatedArrival}

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