import Card from "@/components/shared/Card";
import Badge from "@/components/shared/Badge";

interface Props {
  shipment: {
    shipmentNumber: string;
    trackingNumber: string;
    status: string;
    carrier: string;
    shippingMethod: string;
    estimatedArrival: string;
  };
}

export default function TrackingStatusCard({
  shipment,
}: Props) {
  return (
    <Card title="Shipment Information">

      <div className="space-y-4">

        <Info
          label="Shipment"
          value={shipment.shipmentNumber}
        />

        <Info
          label="Tracking"
          value={shipment.trackingNumber}
        />

        <Info
          label="Carrier"
          value={shipment.carrier}
        />

        <Info
          label="Method"
          value={shipment.shippingMethod}
        />

        <Info
          label="ETA"
          value={shipment.estimatedArrival}
        />

        <div>
          <p className="mb-2 text-sm text-slate-500">
            Status
          </p>

          <Badge>
            {shipment.status}
          </Badge>

        </div>

      </div>

    </Card>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-medium">
        {value}
      </p>
    </div>
  );
}