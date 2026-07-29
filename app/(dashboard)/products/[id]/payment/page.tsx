"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/shared/Card";
import PaymentStatusBadge from "@/components/products/PaymentStatusBadge";

export default function ProductPaymentPage() {
  const { id } = useParams();


  const [product, setProduct] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    method: "bank_transfer",
    gateway: "paystack",
    customerName: "",
    customerEmail: "",
  });

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    const token = localStorage.getItem("accessToken");

    const [productRes, paymentRes] = await Promise.all([
      fetch(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

      fetch(`/api/products/${id}/payment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const productData = await productRes.json();
    const paymentData = await paymentRes.json();
    

    setProduct(productData.data ?? productData);
    setPayments(paymentData.data ?? []);

    if (productData.data || productData) {
      const p = productData.data ?? productData;

      setForm((prev) => ({
        ...prev,
        customerName: p.buyerName,
        customerEmail: p.buyerEmail,
      }));
    }
  }

  function change(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createPayment() {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`/api/products/${id}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      if (!res.ok) {
        alert("Unable to create payment");
        return;
      }

      alert("Payment created");

      loadPage();
    } finally {
      setLoading(false);
    }
  }

  async function clearPayment(paymentId: string) {
    if (!confirm("Clear this payment?")) return;

    const token = localStorage.getItem("accessToken");

    const res = await fetch(`/api/products/${id}/payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentId,
      }),
    });

    if (res.ok) {
      alert("Payment cleared");
      loadPage();
    }
  }

  if (!product) return null;

  return (
    <>
      <DashboardHeader />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Left */}

        <div className="lg:col-span-2 space-y-6">

          <Card title="Create Payment">

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label>Customer</label>

                <input
                  className="mt-2 w-full rounded-xl border p-3"
                  name="customerName"
                  value={form.customerName}
                  onChange={change}
                />

              </div>

              <div>

                <label>Email</label>

                <input
                  className="mt-2 w-full rounded-xl border p-3"
                  name="customerEmail"
                  value={form.customerEmail}
                  onChange={change}
                />

              </div>

              <div>

                <label>Amount</label>

                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border p-3"
                  name="amount"
                  value={form.amount}
                  onChange={change}
                />

              </div>

              <div>

                <label>Currency</label>

                <select
                  name="currency"
                  value={form.currency}
                  onChange={change}
                  className="mt-2 w-full rounded-xl border p-3"
                >
                  <option>USD</option>
                  <option>NGN</option>
                </select>

              </div>

              <div>

                <label>Gateway</label>

                <select
                  name="gateway"
                  value={form.gateway}
                  onChange={change}
                  className="mt-2 w-full rounded-xl border p-3"
                >
                  <option value="paystack">
                    Paystack
                  </option>

                  <option value="stripe">
                    Stripe
                  </option>

                  <option value="paypal">
                    Paypal
                  </option>

                </select>

              </div>

              <div>

                <label>Method</label>

                <select
                  name="method"
                  value={form.method}
                  onChange={change}
                  className="mt-2 w-full rounded-xl border p-3"
                >
                  <option value="bank_transfer">
                    Bank Transfer
                  </option>

                  <option value="credit_card">
                    Credit Card
                  </option>

                  <option value="cash">
                    Cash
                  </option>

                </select>

              </div>

            </div>

            <button
              onClick={createPayment}
              disabled={loading}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white"
            >
              {loading ? "Processing..." : "Create Payment"}
            </button>

          </Card>

          <Card title="Payment History">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="py-3 text-left">
                    Reference
                  </th>

                  <th>Amount</th>

                  <th>Status</th>

                  <th></th>

                </tr>

              </thead>

              <tbody>

                {payments.map((payment: any) => (

                  <tr
                    key={payment._id}
                    className="border-b"
                  >

                    <td className="py-4">
                      {payment.reference}
                    </td>

                    <td>
                      ${payment.amount}
                    </td>

                    <td>

                      <PaymentStatusBadge
                        status={payment.status}
                      />

                    </td>

                    <td>

                      {payment.status !== "completed" && (

                        <button
                          onClick={() =>
                            clearPayment(payment._id)
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 text-white"
                        >
                          Clear
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </Card>

        </div>

        {/* Right */}

        <div className="space-y-6">

          <Card title="Shipment">

            <div className="space-y-4">

              <p>
                <strong>Product</strong>
                <br />
                {product.name}
              </p>

              <p>
                <strong>Customer</strong>
                <br />
                {product.customerName}
              </p>

              <p>
                <strong>Destination</strong>
                <br />
                {product.destination}
              </p>

              <p>
                <strong>Status</strong>
                <br />
                {product.currentStatus}
              </p>

            </div>

          </Card>

          <Card title="Payment Status">

            <PaymentStatusBadge
              status={product.paymentStatus}
            />

          </Card>

        </div>

      </div>

    </>
  );
}