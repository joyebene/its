"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/shared/Card";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",

    customerName: "",
    customerEmail: "",
    customerPhone: "",

    originCountry: "",
    originCity: "",

    destinationCountry: "",
    destinationCity: "",
    destinationAddress: "",

    trackingNumber: "",
    containerNumber: "",

    shippingMethod: "SEA",

    weight: "",
    quantity: "",
    declaredValue: "",

    currentStatus: "CREATED",

    expectedDeparture: "",
    expectedArrival: "",
  });

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        alert("Unable to load product.");
        return;
      }

      const result = await res.json();

      const product = result.data ?? result;

      console.log(product);

      setForm({
        name: product.name || "",
        description: product.description || "",

        customerName: product.buyerName || "",
        customerEmail: product.buyerEmail || "",
        customerPhone: product.buyerPhone || "",

        originCountry: product.shipmentId.origin?.country ?? "",
        originCity: product.shipmentId.origin?.city ?? "",

        destinationCountry: product.shipmentId.destination?.country ?? "",
        destinationCity: product.shipmentId.destination?.city ?? "",
        destinationAddress: [
          product.shippingAddress?.street,
          product.shippingAddress?.city,
          product.shippingAddress?.state,
          product.shippingAddress?.country,
        ]
          .filter(Boolean)
          .join(", "),

        trackingNumber: product.shipmentId.trackingNumber || "",
        containerNumber: product.containerNumber || "",

        shippingMethod: product.shippingMethod || "SEA",

        weight: product.weight || "",
        quantity: product.quantity || "",
        declaredValue: product.declaredValue || "",

        currentStatus: product.currentStatus || "CREATED",

        expectedDeparture:
          product.expectedDeparture?.substring(0, 10) || "",

        expectedArrival:
          product.expectedArrival?.substring(0, 10) || "",
      });
    } finally {
      setLoading(false);
    }
  }

  function change(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveProduct() {
    try {
      setSaving(true);

      const token = localStorage.getItem("accessToken")

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Unable to update product");
        return;
      }

      alert("Product updated successfully.");

      router.push(`/products/${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <p className="mt-10 text-center">
          Loading product...
        </p>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />

      <div className="space-y-6">

        {/* Shipment */}

        <Card title="Shipment Information">

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="font-medium">
                Shipment Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label className="font-medium">
                Tracking Number
              </label>

              <input
                name="trackingNumber"
                value={form.trackingNumber}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="font-medium">
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

          </div>

        </Card>

        {/* Customer */}

        <Card title="Customer Information">

          <div className="grid gap-5 md:grid-cols-3">

            <div>

              <label>Customer Name</label>

              <input
                name="customerName"
                value={form.customerName}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label>Email</label>

              <input
                name="customerEmail"
                value={form.customerEmail}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label>Phone</label>

              <input
                name="customerPhone"
                value={form.customerPhone}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

          </div>

        </Card>

        {/* Origin */}

        <Card title="Origin">

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label>Country</label>

              <input
                name="originCountry"
                value={form.originCountry}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-100 p-3 cursor-not-allowed"
              />

            </div>

            <div>

              <label>City</label>

              <input
                name="originCity"
                value={form.originCity}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-100 p-3 cursor-not-allowed"
              />

            </div>

          </div>

        </Card>

        {/* Destination */}

        <Card title="Destination">

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label>Country</label>

              <input
                name="destinationCountry"
                value={form.destinationCountry}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-100 p-3 cursor-not-allowed"
              />

            </div>

            <div>

              <label>City</label>

              <input
                name="destinationCity"
                value={form.destinationCity}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-100 p-3 cursor-not-allowed"
              />

            </div>

            <div className="md:col-span-2">

              <label>Address</label>

              <textarea
                rows={3}
                name="destinationAddress"
                value={form.destinationAddress}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-100 p-3 cursor-not-allowed"
              />

            </div>

          </div>

        </Card>

        {/* Shipment Details */}

        <Card title="Shipment Details">

          <div className="grid gap-5 md:grid-cols-3">

            <div>

              <label>Container Number</label>

              <input
                name="customerEmail"
                value={form.customerEmail}
                readOnly
                className="mt-2 w-full rounded-xl border bg-gray-100 p-3 cursor-not-allowed"
              />

            </div>

            <div>

              <label>Shipping Method</label>

              <select
                name="shippingMethod"
                value={form.shippingMethod}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              >
                <option value="SEA">Sea</option>
                <option value="AIR">Air</option>
                <option value="LAND">Land</option>
              </select>

            </div>

            <div>

              <label>Status</label>

              <select
                name="currentStatus"
                value={form.currentStatus}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              >
                <option value="CREATED">Created</option>
                <option value="WAREHOUSE_RECEIVED">
                  Warehouse Received
                </option>
                <option value="IN_TRANSIT">
                  In Transit
                </option>
                <option value="CUSTOMS_CLEARANCE">
                  Customs Clearance
                </option>
                <option value="OUT_FOR_DELIVERY">
                  Out For Delivery
                </option>
                <option value="DELIVERED">
                  Delivered
                </option>
              </select>

            </div>

            <div>

              <label>Weight (kg)</label>

              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label>Declared Value</label>

              <input
                type="number"
                name="declaredValue"
                value={form.declaredValue}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label>Expected Departure</label>

              <input
                type="date"
                name="expectedDeparture"
                value={form.expectedDeparture}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

            <div>

              <label>Expected Arrival</label>

              <input
                type="date"
                name="expectedArrival"
                value={form.expectedArrival}
                onChange={change}
                className="mt-2 w-full rounded-xl border p-3"
              />

            </div>

          </div>

        </Card>

        <div className="flex justify-end gap-4">

          <button
            onClick={() => router.back()}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={saveProduct}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </>
  );
}