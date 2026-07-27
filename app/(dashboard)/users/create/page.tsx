"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

export default function CreateUserPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const token =
        localStorage.getItem("accessToken");

      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/users");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create User"
        description="Create a new system user."
      />

      <Card title="User Information">
        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2"
        >
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="WAREHOUSE">
                Warehouse
              </option>
              <option value="LOGISTICS">
                Logistics
              </option>
              <option value="CUSTOMS">
                Customs
              </option>
              <option value="DELIVERY">
                Delivery
              </option>
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
              Create User
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}