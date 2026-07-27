"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

interface CustomsForm {
  shipment: string;
  dutyAmount: string;
  status:
    | "PENDING"
    | "UNDER_INSPECTION"
    | "DUTY_PENDING"
    | "DUTY_PAID"
    | "CLEARED";
  remarks: string;
}

export default function EditCustomsPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [formData, setFormData] = useState<CustomsForm>({
    shipment: "",
    dutyAmount: "",
    status: "PENDING",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustoms();
  }, []);

  async function fetchCustoms() {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/customs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      const customs = result.data;

      setFormData({
        shipment: customs.shipment?._id,
        dutyAmount: customs.dutyAmount.toString(),
        status: customs.status,
        remarks: customs.remarks ?? "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/customs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment: formData.shipment,
          dutyAmount: Number(formData.dutyAmount),
          status: formData.status,
          remarks: formData.remarks,
        }),
      });

      if (res.ok) {
        router.push("/customs");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Customs Record"
        description="Update customs clearance information."
      />

      <Card title="Customs Details">
        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2"
        >
          <Input
            label="Shipment ID"
            name="shipment"
            value={formData.shipment}
            onChange={handleChange}
          />

          <Input
            label="Duty Amount"
            name="dutyAmount"
            type="number"
            value={formData.dutyAmount}
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
              <option value="PENDING">Pending</option>
              <option value="UNDER_INSPECTION">Under Inspection</option>
              <option value="DUTY_PENDING">Duty Pending</option>
              <option value="DUTY_PAID">Duty Paid</option>
              <option value="CLEARED">Cleared</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              name="remarks"
              rows={4}
              value={formData.remarks}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 md:col-span-2">
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
              Update Customs
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}