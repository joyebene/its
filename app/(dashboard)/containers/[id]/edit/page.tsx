"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

interface ContainerForm {
  containerNumber: string;
  type: string;
  carrier: string;
  originPort: string;
  destinationPort: string;
  expectedArrival: string;
  status: string;
}

export default function EditContainerPage() {
  const router = useRouter();

  // Temporary dummy data
  const [formData, setFormData] = useState<ContainerForm>({
    containerNumber: "MSKU1234567",
    type: "40FT",
    carrier: "Maersk",
    originPort: "Shanghai",
    destinationPort: "Lagos",
    expectedArrival: "2026-08-20",
    status: "IN_TRANSIT",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // TODO:
    // await fetch(`/api/containers/${id}`, {
    //   method: "PUT",
    //   body: JSON.stringify(formData),
    // })

    setTimeout(() => {
      setLoading(false);
      router.push("/containers");
    }, 1000);
  };

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
            label="Container Number"
            name="containerNumber"
            value={formData.containerNumber}
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="20FT">20FT</option>
              <option value="40FT">40FT</option>
              <option value="LCL">LCL</option>
            </select>
          </div>

          <Input
            label="Carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
          />

          <Input
            label="Origin Port"
            name="originPort"
            value={formData.originPort}
            onChange={handleChange}
          />

          <Input
            label="Destination Port"
            name="destinationPort"
            value={formData.destinationPort}
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
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
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