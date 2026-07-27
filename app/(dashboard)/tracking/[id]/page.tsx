"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import TrackingStatusCard from "@/components/tracking/TrackingStatusCard";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import TrackingMap from "@/components/tracking/TrackingMap";

export default function TrackingDetailsPage() {
  const { id } = useParams();

  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShipment() {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`/api/shipments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          setShipment(result.data);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchShipment();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!shipment) {
    return <p>Shipment not found.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tracking Details"
        description="Monitor shipment progress."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <TrackingStatusCard
          shipment={shipment.shipment}
        />

        <div className="lg:col-span-2">
          <TrackingTimeline
            timeline={shipment.items}
          />
        </div>
      </div>

      <TrackingMap />
    </div>
  );
}