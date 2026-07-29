"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/shared/Card";

import {
  MapPin,
  Clock3,
  Plus,
  Ship,
} from "lucide-react";

export default function TrackingPage() {
  const { id } = useParams();

  const [tracking, setTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    status: "",
    location: "",
    remarks: "",
  });

  useEffect(() => {
    loadTracking();
  }, []);

  async function loadTracking() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`/api/products/${id}/tracking`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log(data);


    setTracking(
      Array.isArray(data.data?.trackingHistory)
        ? data.data.trackingHistory
        : []
    );
  }
  function change(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function addTracking() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/products/${id}/tracking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(form),
        }
      );

      const result = await res.json();


      if (!res.ok) {
        alert(result.message);
        return;
      }

      setForm({
        status: "",
        location: "",
        remarks: "",
      });

      loadTracking();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DashboardHeader />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Timeline */}

        <div className="lg:col-span-2">

          <Card title="Tracking Timeline">

            <div className="space-y-8">

              {tracking.map((item) => (

                <div
                  key={item._id}
                  className="flex gap-5"
                >

                  <div className="flex flex-col items-center">

                    <div className="rounded-full bg-blue-100 p-3 text-blue-600">

                      <Ship size={18} />

                    </div>

                    <div className="mt-2 h-full w-[2px] bg-slate-200" />

                  </div>

                  <div className="pb-8">

                    <h3 className="font-semibold">

                      {item.status}

                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                      <MapPin size={16} />

                      {item.location}

                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">

                      <Clock3 size={14} />

                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "-"}

                    </div>

                    {item.remarks && (

                      <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm">

                        {item.remarks}

                      </p>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </Card>

        </div>

        {/* Add Tracking */}

        <div>

          <Card title="Add Tracking Update">

            <div className="space-y-5">

              <div>
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={change}
                  className="mt-2 w-full rounded-xl border p-3"
                >
                  <option value="">Select Status</option>

                  <option value="in_transit">
                    In Transit
                  </option>

                  <option value="arrived_port">
                    Arrived at Port
                  </option>

                  <option value="customs_clearance">
                    Customs Clearance
                  </option>

                  <option value="out_for_delivery">
                    Out for Delivery
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>
                </select>
              </div>

              <div>

                <label>Location</label>

                <input
                  className="mt-2 w-full rounded-xl border p-3"
                  name="location"
                  value={form.location}
                  onChange={change}
                />

              </div>

              <div>

                <label>Remarks</label>

                <textarea
                  className="mt-2 w-full rounded-xl border p-3"
                  rows={5}
                  name="remarks"
                  value={form.remarks}
                  onChange={change}
                />

              </div>

              <button
                onClick={addTracking}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white"
              >
                <Plus size={18} />

                {loading
                  ? "Saving..."
                  : "Add Tracking"}

              </button>

            </div>

          </Card>

        </div>

      </div>

    </>
  );
}