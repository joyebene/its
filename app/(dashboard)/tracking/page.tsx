"use client";

import { useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import DataTable, {
  TableColumn,
} from "@/components/shared/DataTable";

type TrackingTimeline = {
  _id: string;
  status: string;
  location: string;
  remarks: string;
  eventTime: string;
  updatedBy?: {
    firstName: string;
    lastName: string;
  };
};

type TrackingResponse = {
  shipment: {
    _id: string;
    shipmentNumber: string;
    trackingNumber: string;
    status: string;
  };
  timeline: TrackingTimeline[];
};

const columns: TableColumn<TrackingTimeline>[] = [
  {
    key: "status",
    title: "Status",
  },
  {
    key: "location",
    title: "Location",
  },
  {
    key: "remarks",
    title: "Remarks",
  },
  {
    key: "eventTime",
    title: "Date",
    render: (item) =>
      new Date(item.eventTime).toLocaleString(),
  },
  {
    key: "updatedBy",
    title: "Updated By",
    render: (item) =>
      item.updatedBy
        ? `${item.updatedBy.firstName} ${item.updatedBy.lastName}`
        : "-",
  },
];

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const [tracking, setTracking] =
    useState<TrackingResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleTrack() {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/tracking?trackingNumber=${trackingNumber}`
      );

      const result = await response.json();

      if (!response.ok) {
        setTracking(null);
        setError(result.message || "Shipment not found.");
        return;
      }

      setTracking(result.data);
    } catch {
      setTracking(null);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Shipment Tracking"
        description="Track shipments using tracking numbers."
      />

      <Card title="Track Shipment">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">

          <div className="flex-1">
            <Input
              label="Tracking Number"
              name="trackingNumber"
              value={trackingNumber}
              onChange={(e) =>
                setTrackingNumber(e.target.value)
              }
              placeholder="Enter tracking number..."
            />
          </div>

          <Button
            onClick={handleTrack}
            loading={loading}
            className="px-6"
          >
            Track Shipment
          </Button>

        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
      </Card>

      {tracking && (
        <Card
          title="Shipment Information"
          description="Shipment details."
        >
          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Shipment Number
              </p>

              <p className="font-semibold">
                {tracking.shipment.shipmentNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Tracking Number
              </p>

              <p className="font-semibold">
                {tracking.shipment.trackingNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Current Status
              </p>

              <p className="font-semibold">
                {tracking.shipment.status}
              </p>
            </div>

          </div>
        </Card>
      )}

      <Card
        title="Tracking Timeline"
        description="Shipment movement history."
      >
        <DataTable
          columns={columns}
          data={tracking?.timeline ?? []}
          resource="tracking"
          showEdit={false}
        />
      </Card>

    </div>
  );
}