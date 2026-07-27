"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

interface ContainerForm {
  type: string;
  carrier: string;
  sealNumber: string;
  expectedDeparture: string;
  expectedArrival: string;
  status: string;
}

export default function EditContainerPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState<ContainerForm>({
    type: "",
    carrier: "",
    sealNumber: "",
    expectedDeparture: "",
    expectedArrival: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    if (id) {
      fetchContainer();
    }
  }, [id]);

  async function fetchContainer() {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/containers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        const container = result.data.container;

        setFormData({
          type: container.type ?? "",
          carrier: container.carrier ?? "",
          sealNumber: container.sealNumber ?? "",
          expectedDeparture: container.expectedDeparture
            ? container.expectedDeparture.slice(0, 10)
            : "",
          expectedArrival: container.expectedArrival
            ? container.expectedArrival.slice(0, 10)
            : "",
          status: container.status,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }

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

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/containers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      router.push("/containers");
    } catch (err) {
      console.error(err);
      alert("Failed to update container.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Edit Container"
        description="Update container information."
      />

      <Card title="Container Details">

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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="20FT">20FT</option>
              <option value="40FT">40FT</option>
              <option value="40HQ">40HQ</option>
            </select>
          </div>

          <Input
            label="Seal Number"
            name="sealNumber"
            value={formData.sealNumber}
            onChange={handleChange}
          />

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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="AVAILABLE">Available</option>
              <option value="LOADED">Loaded</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="ARRIVED">Arrived</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">

            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
            >
              Update Container
            </Button>

          </div>

        </form>

      </Card>

    </div>
  );
}