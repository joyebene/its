"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

export default function EditShipmentPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    shipmentNumber: "SHP-1001",
    trackingNumber: "TRK-1001",
    carrier: "Maersk",
    shippingMethod: "SEA",
    status: "IN_TRANSIT",
    estimatedArrival: "2026-08-10",
    containerNumber: "MSKU1234567",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log(formData);

    router.push("/shipments");
  };

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
            label="Shipment Number"
            name="shipmentNumber"
            value={formData.shipmentNumber}
            onChange={handleChange}
          />

          <Input
            label="Tracking Number"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
          />

          <Input
            label="Carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
          />

          <Input
            label="Container Number"
            name="containerNumber"
            value={formData.containerNumber}
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
              <option value="AIR">Air</option>
              <option value="SEA">Sea</option>
              <option value="LAND">Land</option>
            </select>
          </div>

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
              <option value="CREATED">Created</option>
              <option value="READY_FOR_PICKUP">
                Ready for Pickup
              </option>
              <option value="COLLECTED">
                Collected
              </option>
              <option value="WAREHOUSE_RECEIVED">
                Warehouse Received
              </option>
              <option value="CONSOLIDATED">
                Consolidated
              </option>
              <option value="EXPORT_CLEARANCE">
                Export Clearance
              </option>
              <option value="IN_TRANSIT">
                In Transit
              </option>
              <option value="ARRIVED_DESTINATION">
                Arrived Destination
              </option>
              <option value="CUSTOMS_CLEARANCE">
                Customs Clearance
              </option>
              <option value="IMPORT_WAREHOUSE">
                Import Warehouse
              </option>
              <option value="OUT_FOR_DELIVERY">
                Out for Delivery
              </option>
              <option value="DELIVERED">
                Delivered
              </option>
              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

          <Input
            label="Estimated Arrival"
            type="date"
            name="estimatedArrival"
            value={formData.estimatedArrival}
            onChange={handleChange}
          />

          <div className="md:col-span-2 flex justify-end gap-3">

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push("/shipments")
              }
            >
              Cancel
            </Button>

            <Button type="submit">
              Update Shipment
            </Button>

          </div>

        </form>

      </Card>

    </div>
  );
}