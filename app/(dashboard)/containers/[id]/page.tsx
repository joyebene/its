"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Card from "@/components/shared/Card";
import PageHeader from "@/components/shared/PageHeader";
import ContainerStatusBadge from "@/components/container/ContainerStatusBadge";

interface Container {
  _id: string;
  containerNumber: string;
  carrier: string;
  type: string;
  sealNumber?: string;
  expectedDeparture?: string;
  expectedArrival?: string;
  status:
    | "AVAILABLE"
    | "LOADED"
    | "IN_TRANSIT"
    | "ARRIVED";
}

export default function ContainerDetailsPage() {
  const { id } = useParams();

  const [container, setContainer] =
    useState<Container | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchContainer();
  }, [id]);

  async function fetchContainer() {
    try {
      const token =
        localStorage.getItem("accessToken");

      const res = await fetch(
        `/api/containers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setContainer(result.data.container);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <p className="text-center py-10">
        Loading...
      </p>
    );
  }

  if (!container) {
    return (
      <p className="text-center py-10">
        Container not found.
      </p>
    );
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Container Details"
        description="Container information."
      />

      <Card title="Container Information">

        <div className="grid gap-6 md:grid-cols-2">

          <Info
            label="Container Number"
            value={container.containerNumber}
          />

          <Info
            label="Carrier"
            value={container.carrier}
          />

          <Info
            label="Container Type"
            value={container.type}
          />

          <Info
            label="Seal Number"
            value={
              container.sealNumber || "-"
            }
          />

          <Info
            label="Expected Departure"
            value={
              container.expectedDeparture
                ? new Date(
                    container.expectedDeparture
                  ).toLocaleDateString()
                : "-"
            }
          />

          <Info
            label="Expected Arrival"
            value={
              container.expectedArrival
                ? new Date(
                    container.expectedArrival
                  ).toLocaleDateString()
                : "-"
            }
          />

          <div>
            <p className="text-sm text-slate-500">
              Status
            </p>

            <div className="mt-1">
              <ContainerStatusBadge
                status={container.status}
              />
            </div>
          </div>

        </div>

      </Card>

    </div>
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

      <p className="font-semibold">
        {value}
      </p>
    </div>
  );
}