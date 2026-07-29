"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ShipmentForm from "@/components/shipment/ShipmentForm";

export default function CreateShipmentPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) return;

    setToken(accessToken);
    loadProducts(accessToken);
  }, []);

  async function loadProducts(token: string) {
    try {
      const res = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setProducts(data.data ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function createShipment(values: any) {
    if (!token) return;

    try {
      setLoading(true);

      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create shipment");
        return;
      }

      router.push("/shipments");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Create Shipment
        </h1>

        <p className="text-gray-500">
          Register a new shipment into the system.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-8">
        <ShipmentForm
          products={products}
          loading={loading}
          onSubmit={createShipment}
        />
      </div>
    </div>
  );
}