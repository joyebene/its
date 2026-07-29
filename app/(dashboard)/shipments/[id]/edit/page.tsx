"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

import {
  ShippingMethod,
  ShipmentStatus,
} from "@/lib/types";

export default function EditShipmentPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    product: "",

    origin: {
      city: "",
      state: "",
      country: "",
    },

    destination: {
      city: "",
      state: "",
      country: "",
    },

    carrier: "",

    shippingMethod: ShippingMethod.SEA,

    estimatedDeparture: "",

    estimatedArrival: "",

    status: ShipmentStatus.CREATED,
  });

  useEffect(() => {
    if (id) {
      loadShipment();
    }
  }, [id]);

  async function loadShipment() {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/shipments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      const shipment = result.data;

      setFormData({
        product:
          typeof shipment.product === "object"
            ? shipment.product._id
            : shipment.product ?? "",

        origin: shipment.origin,

        destination: shipment.destination,

        carrier: shipment.carrier ?? "",

        shippingMethod: shipment.shippingMethod,

        estimatedDeparture:
          shipment.estimatedDeparture?.slice(0, 10) ?? "",

        estimatedArrival:
          shipment.estimatedArrival?.slice(0, 10) ?? "",

        status: shipment.status,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("origin.")) {
      const key = name.split(".")[1];

      return setFormData((prev) => ({
        ...prev,
        origin: {
          ...prev.origin,
          [key]: value,
        },
      }));
    }

    if (name.startsWith("destination.")) {
      const key = name.split(".")[1];

      return setFormData((prev) => ({
        ...prev,
        destination: {
          ...prev.destination,
          [key]: value,
        },
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      // Remove status before updating shipment
      const { status, ...shipmentData } = formData;

      const res = await fetch(`/api/shipments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shipmentData),
      });

      if (!res.ok) {
        console.log(await res.json());
        return;
      }

      // Update shipment status separately
      const statusRes = await fetch(
        `/api/shipments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: formData.status,
            location: `${formData.destination.city}, ${formData.destination.country}`,
            remarks: "Shipment updated from dashboard",
          }),
        }
      );

      console.log(await statusRes.json());

      if (statusRes.ok) {
        router.push("/shipments");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Shipment"
        description="Update shipment information."
      />

      <Card>
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 md:grid-cols-2"
        >
          <Input
            label="Carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Shipping Method
            </label>

            <select
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              {Object.values(ShippingMethod).map(
                (method) => (
                  <option
                    key={method}
                    value={method}
                  >
                    {method}
                  </option>
                )
              )}
            </select>
          </div>

          <Input
            label="Origin City"
            name="origin.city"
            value={formData.origin.city}
            onChange={handleChange}
          />

          <Input
            label="Origin State"
            name="origin.state"
            value={formData.origin.state}
            onChange={handleChange}
          />

          <Input
            label="Origin Country"
            name="origin.country"
            value={formData.origin.country}
            onChange={handleChange}
          />

          <Input
            label="Destination City"
            name="destination.city"
            value={formData.destination.city}
            onChange={handleChange}
          />

          <Input
            label="Destination State"
            name="destination.state"
            value={formData.destination.state}
            onChange={handleChange}
          />

          <Input
            label="Destination Country"
            name="destination.country"
            value={formData.destination.country}
            onChange={handleChange}
          />

          <Input
            type="date"
            label="Estimated Departure"
            name="estimatedDeparture"
            value={formData.estimatedDeparture}
            onChange={handleChange}
          />

          <Input
            type="date"
            label="Estimated Arrival"
            name="estimatedArrival"
            value={formData.estimatedArrival}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Shipment Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              {Object.values(ShipmentStatus).map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.replaceAll("_", " ")}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex justify-end gap-3 md:col-span-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push("/shipments")
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
            >
              Update Shipment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}