"use client";

import { useState } from "react";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import { ShippingMethod } from "@/lib/types";

interface Product {
  _id: string;
  name: string;
  sku: string;
}

export interface ShipmentFormData {
  product: string;

  origin: {
    city: string;
    state: string;
    country: string;
  };

  destination: {
    city: string;
    state: string;
    country: string;
  };

  carrier: string;
  containerNumber: string;
  shippingMethod: ShippingMethod;
  estimatedDeparture: string;
  estimatedArrival: string;
}

interface Props {
  products: Product[];
  defaultValues?: Partial<ShipmentFormData>;
  onSubmit: (values: ShipmentFormData) => Promise<void>;
  loading?: boolean;
}

export default function ShipmentForm({
  products,
  defaultValues,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<ShipmentFormData>({
    product: defaultValues?.product ?? "",

    origin: {
      city: defaultValues?.origin?.city ?? "",
      state: defaultValues?.origin?.state ?? "",
      country: defaultValues?.origin?.country ?? "",
    },

    destination: {
      city: defaultValues?.destination?.city ?? "",
      state: defaultValues?.destination?.state ?? "",
      country: defaultValues?.destination?.country ?? "",
    },

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
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">

        {/* Product */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Product
          </label>

          <select
            name="product"
            value={form.product}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
            required
          >
            <option value="">
              Select Product
            </option>

            {products.map((product) => (
              <option
                key={product._id}
                value={product._id}
              >
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>

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

        {/* Origin */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg border-b pb-2">
            Origin Address
          </h3>
        </div>

        <Input
          label="Origin City"
          name="origin.city"
          value={form.origin.city}
          onChange={handleChange}
        />

        <Input
          label="Origin State"
          name="origin.state"
          value={form.origin.state}
          onChange={handleChange}
        />

        <Input
          label="Origin Country"
          name="origin.country"
          value={form.origin.country}
          onChange={handleChange}
        />

        {/* Destination */}
        <div className="md:col-span-2 mt-4">
          <h3 className="font-semibold text-lg border-b pb-2">
            Destination Address
          </h3>
        </div>

        <Input
          label="Destination City"
          name="destination.city"
          value={form.destination.city}
          onChange={handleChange}
        />

        <Input
          label="Destination State"
          name="destination.state"
          value={form.destination.state}
          onChange={handleChange}
        />

        <Input
          label="Destination Country"
          name="destination.country"
          value={form.destination.country}
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