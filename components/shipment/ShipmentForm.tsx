"use client";

import { useState } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import { ShippingMethod } from "@/lib/types";

interface ShipmentFormData {
  shipmentNumber: string;
  trackingNumber: string;
  carrier: string;
  containerNumber: string;
  shippingMethod: ShippingMethod;
  estimatedDeparture: string;
  estimatedArrival: string;
}

interface Props {
  defaultValues?: Partial<ShipmentFormData>;
  onSubmit: (values: ShipmentFormData) => Promise<void>;
  loading?: boolean;
}

export default function ShipmentForm({
  defaultValues,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<ShipmentFormData>({
    shipmentNumber: defaultValues?.shipmentNumber ?? "",
    trackingNumber: defaultValues?.trackingNumber ?? "",
    carrier: defaultValues?.carrier ?? "",
    containerNumber: defaultValues?.containerNumber ?? "",
    shippingMethod:
      defaultValues?.shippingMethod ?? ShippingMethod.SEA,
    estimatedDeparture:
      defaultValues?.estimatedDeparture ?? "",
    estimatedArrival:
      defaultValues?.estimatedArrival ?? "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Shipment Number"
          name="shipmentNumber"
          value={form.shipmentNumber}
          onChange={handleChange}
        />

        <Input
          label="Tracking Number"
          name="trackingNumber"
          value={form.trackingNumber}
          onChange={handleChange}
        />

        <Input
          label="Carrier"
          name="carrier"
          value={form.carrier}
          onChange={handleChange}
        />

        <Input
          label="Container Number"
          name="containerNumber"
          value={form.containerNumber}
          onChange={handleChange}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Shipping Method
          </label>

          <select
            name="shippingMethod"
            value={form.shippingMethod}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          >
            {Object.values(ShippingMethod).map((method) => (
              <option
                key={method}
                value={method}
              >
                {method}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Estimated Departure"
          type="date"
          name="estimatedDeparture"
          value={form.estimatedDeparture}
          onChange={handleChange}
        />

        <Input
          label="Estimated Arrival"
          type="date"
          name="estimatedArrival"
          value={form.estimatedArrival}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        loading={loading}
      >
        Save Shipment
      </Button>
    </form>
  );
}