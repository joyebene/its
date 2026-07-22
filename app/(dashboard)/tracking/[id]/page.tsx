import PageHeader from "@/components/shared/PageHeader";
import TrackingStatusCard from "@/components/tracking/TrackingStatusCard";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import TrackingMap from "@/components/tracking/TrackingMap";

export default function TrackingDetailsPage() {
  const shipment = {
    shipmentNumber: "SHP-001",
    trackingNumber: "TRK-001",
    status: "IN TRANSIT",
    carrier: "Maersk",
    shippingMethod: "Sea Freight",
    estimatedArrival: "25 July 2026",
  };

  return (
    <div className="space-y-6">

      <PageHeader
        title="Tracking Details"
        description="Monitor shipment progress."
      />

      <div className="grid gap-6 lg:grid-cols-3">

        <TrackingStatusCard shipment={shipment} />

        <div className="lg:col-span-2">
          <TrackingTimeline />
        </div>

      </div>

      <TrackingMap />

    </div>
  );
}