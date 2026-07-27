"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

export default function CreateContainerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    carrier: "",
    type: "",
    sealNumber: "",
    expectedDeparture: "",
    expectedArrival: "",
    status: "AVAILABLE",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem("accessToken");

      const response = await fetch(
        "/api/containers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      router.push("/containers");
    } catch (err) {
      console.error(err);
      alert("Failed to create container.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Create Container"
        description="Register a new shipping container."
      />

      <Card>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2"
        >

          <Input
            label="Carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Container Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">
                Select Type
              </option>

              <option value="20FT">
                20FT
              </option>

              <option value="40FT">
                40FT
              </option>

              <option value="40HQ">
                40HQ
              </option>
            </select>
          </div>

          <Input
            label="Seal Number"
            name="sealNumber"
            value={formData.sealNumber}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="AVAILABLE">
                Available
              </option>

              <option value="LOADED">
                Loaded
              </option>

              <option value="IN_TRANSIT">
                In Transit
              </option>

              <option value="ARRIVED">
                Arrived
              </option>
            </select>
          </div>

          <Input
            type="date"
            label="Expected Departure"
            name="expectedDeparture"
            value={formData.expectedDeparture}
            onChange={handleChange}
          />

          <Input
            type="date"
            label="Expected Arrival"
            name="expectedArrival"
            value={formData.expectedArrival}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              loading={loading}
            >
              Save Container
            </Button>
          </div>

        </form>

      </Card>

    </div>
  );
}