"use client";

import { useEffect, useState } from "react";
import Card from "@/components/shared/Card";
import { MapPinned } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const destinationIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface TrackingMapProps {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    updatedAt: string;
  } | null;

  destinationAddress?: string;
}

function FitBounds({
  current,
  destination,
}: {
  current: [number, number];
  destination?: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (destination) {
      map.fitBounds([current, destination], {
        padding: [60, 60],
      });
    } else {
      map.setView(current, 13);
    }
  }, [map, current, destination]);

  return null;
}

export default function TrackingMap({
  location,
  destinationAddress,
}: TrackingMapProps) {
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  console.log("Destination Address:", destinationAddress);

  useEffect(() => {
    async function geocodeAddress() {
      if (!destinationAddress) return;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            destinationAddress
          )}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();
console.log("joy");

        console.log("Geocode Response:", data);

        if (data.length > 0) {
          setDestination({
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
          });
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
      }
    }

    geocodeAddress();
  }, [destinationAddress]);

  if (
    !location ||
    typeof location.latitude !== "number" ||
    typeof location.longitude !== "number"
  ) {
    return (
      <Card title="Current Shipment Location">
        <div className="flex h-80 items-center justify-center rounded-xl border border-dashed">
          <div className="text-center">
            <MapPinned
              size={50}
              className="mx-auto mb-3 text-slate-400"
            />

            <p className="text-lg font-semibold">
              No Location Available
            </p>

            <p className="text-sm text-slate-500">
              GPS location has not been updated yet.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const current: [number, number] = [
    location.latitude,
    location.longitude,
  ];

  const destinationPosition = destination
    ? ([destination.latitude, destination.longitude] as [
        number,
        number,
      ])
    : undefined;

  return (
    <Card title="Live Product Tracking">
      <div className="mb-4 rounded-lg bg-slate-50 p-4 space-y-2">
        <div>
          <p className="font-medium">
            📍 Current Position
          </p>

          <p className="text-sm text-slate-500">
            {location.address || "Current GPS Position"}
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Latitude: {location.latitude}
        </div>

        <div className="text-sm text-slate-500">
          Longitude: {location.longitude}
        </div>

        {destinationAddress && (
          <div className="pt-2 border-t">
            <p className="font-medium">
              🎯 Destination
            </p>

            <p className="text-sm text-slate-500">
              {destinationAddress}
            </p>
          </div>
        )}

        <p className="text-xs text-slate-400">
          Last Updated{" "}
          {new Date(location.updatedAt).toLocaleString()}
        </p>
      </div>

      <MapContainer
        center={current}
        zoom={13}
        className="h-125 w-full rounded-xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds
          current={current}
          destination={destinationPosition}
        />

        {/* Current Location */}
        <Marker position={current}>
          <Popup>
            <strong>Current Product Location</strong>
          </Popup>
        </Marker>

        {/* Destination */}
        {destinationPosition && (
          <Marker
            position={destinationPosition}
            icon={destinationIcon}
          >
            <Popup>
              <strong>Destination</strong>
              <br />
              {destinationAddress}
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {destinationPosition && (
          <Polyline
            positions={[
              current,
              destinationPosition,
            ]}
          />
        )}
      </MapContainer>
    </Card>
  );
}