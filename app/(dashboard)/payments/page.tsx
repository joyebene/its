"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Eye,
  RefreshCcw,
  RotateCcw,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";

interface Payment {
  _id: string;
  reference: string;
  customerName: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPayments() {
    try {
      const res = await fetch("/api/payments");
      const data = await res.json();

      setPayments(data.data || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <>
      <DashboardHeader
        title="Payments"
        subtitle ="Manage customer payments"
      />

      <div className="mb-6 flex justify-end">
        <Link href="payments/create">
          <Button>
            <Plus size={18} />
            Create Payment
          </Button>
        </Link>
      </div>

      <Card title="Payment Records">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b"
                  >
                    <td>{payment.reference}</td>

                    <td>{payment.customerName}</td>

                    <td>
                      {payment.currency} {payment.amount}
                    </td>

                    <td>{payment.method}</td>

                    <td>{payment.status}</td>

                    <td>
                      {new Date(
                        payment.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/payments/${payment._id}`}
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          href={`/dashboard/payments/${payment._id}/process`}
                        >
                          <RefreshCcw size={18} />
                        </Link>

                        <Link
                          href={`/dashboard/payments/${payment._id}/refund`}
                        >
                          <RotateCcw size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}