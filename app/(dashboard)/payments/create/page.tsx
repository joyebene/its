"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
}

export default function NewPaymentPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    amount: "",
    currency: "USD",
    method: "BANK_TRANSFER",
    gateway: "PAYSTACK",
    customerName: "",
    customerEmail: "",
    notes: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      setProducts(data.data || data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Payment created successfully.");

      router.push("/payments");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Create Payment"
        subtitle="Create a new payment for a product"
      />

      <Card title="Payment Information">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product
              </label>

              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Select Product
                </option>

                {products.map((product) => (
                  <option
                    key={product._id}
                    value={product._id}
                  >
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Currency
              </label>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option>USD</option>
                <option>NGN</option>
                <option>EUR</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Payment Method
              </label>

              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="BANK_TRANSFER">
                  Bank Transfer
                </option>

                <option value="CARD">
                  Card
                </option>

                <option value="CASH">
                  Cash
                </option>

                <option value="MOBILE_MONEY">
                  Mobile Money
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Gateway
              </label>

              <select
                name="gateway"
                value={form.gateway}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="PAYSTACK">
                  Paystack
                </option>

                <option value="STRIPE">
                  Stripe
                </option>

                <option value="FLUTTERWAVE">
                  Flutterwave
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Customer Name
              </label>

              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Customer Email
              </label>

              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Payment"}
          </Button>
        </form>
      </Card>
    </>
  );
}