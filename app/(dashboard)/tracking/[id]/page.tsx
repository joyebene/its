"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import TrackingStatusCard from "@/components/tracking/TrackingStatusCard";
import TrackingMap from "@/components/tracking/TrackingMap";
import { CurrentLocation } from "@/lib/types";

export default function TrackingDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null);

  const [loading, setLoading] = useState(true);
  const [startingTracking, setStartingTracking] = useState(false);

  async function fetchProduct() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      setProduct(result.data);

      if (
        result.data.currentLocation &&
        typeof result.data.currentLocation.latitude === "number" &&
        typeof result.data.currentLocation.longitude === "number"
      ) {
        setCurrentLocation(result.data.currentLocation);
      } else {
        setCurrentLocation(null);
      }
    }
  }

  async function fetchCurrentLocation() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`/api/products/${id}/location`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (
      res.ok &&
      result.data &&
      typeof result.data.latitude === "number" &&
      typeof result.data.longitude === "number"
    ) {
      setCurrentLocation(result.data);
    } else {
      setCurrentLocation(null);
    }
  }

  async function startTracking() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setStartingTracking(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const token = localStorage.getItem("accessToken");

          await fetch(`/api/products/${id}/location`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });

          await Promise.all([
            fetchProduct(),
            fetchCurrentLocation(),
          ]);
        } finally {
          setStartingTracking(false);
        }
      },
      (err) => {
        console.error(err);
        alert("Unable to access your current location.");
        setStartingTracking(false);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        await Promise.all([
          fetchProduct(),
          fetchCurrentLocation(),
        ]);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const destinationAddress = [
  product?.shipmentId?.destination?.city,
  product?.shipmentId?.destination?.state,
  product?.shipmentId?.destination?.country,
]
  .filter(Boolean)
  .join(", ");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Tracking"
        description="Monitor the real-time location of this product."
      />

      <TrackingStatusCard product={product} />

      {!currentLocation ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">
            Tracking has not started
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Start tracking to capture the product&apos;s current GPS location.
          </p>

          <button
            onClick={startTracking}
            disabled={startingTracking}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {startingTracking ? "Starting..." : "Start Tracking"}
          </button>
        </div>
      ) : (
        <TrackingMap
          location={currentLocation}
          destinationAddress={destinationAddress}
        />
      )}
    </div>
  );
}