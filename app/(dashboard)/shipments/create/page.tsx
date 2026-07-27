"use client";

import { useRouter } from "next/navigation";
import ShipmentForm from "@/components/shipment/ShipmentForm";
import { useEffect, useState } from "react";

export default function CreateShipmentPage() {
  const router = useRouter();
   const [token, setToken] = useState<string | null>(null);

    useEffect(() => {

    const accessToken =
      localStorage.getItem("accessToken");

    setToken(accessToken);

  }, []);



  async function createShipment(values: any) {
    const response = await fetch("/api/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      router.push("/shipments");
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
          onSubmit={createShipment}
        />

      </div>

    </div>
  );
}