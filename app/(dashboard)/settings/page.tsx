"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await res.json();
      console.log(data);
      

      setForm({
        firstName: data.user.firstName ?? "",
        lastName: data.user.lastName ?? "",
        email: data.user.email ?? "",
        phone: data.user.phone ?? "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and system preferences."
      />

      <Card title="Profile Information">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            disabled={loading}
            className="md:w-1/4"
          >
            {loading ? "Loading..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      <Card title="Security">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="md:w-1/4">
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
}