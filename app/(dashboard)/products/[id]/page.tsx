"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/shared/Card";
import ProductStatusBadge from "@/components/products/ProductStatusBadge";
import PaymentStatusBadge from "@/components/products/PaymentStatusBadge";

import {
  Package,
  MapPin,
  CreditCard,
  User,
  Calendar,
  Ship,
} from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [tracking, setTracking] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [productRes, trackingRes, paymentRes] = await Promise.all([
        fetch(`/api/products/${id}`, {
          headers,
        }),
        fetch(`/api/products/${id}/tracking`, {
          headers,
        }),
        fetch(`/api/products/${id}/payment`, {
          headers,
        }),
      ]);


      const productData = await productRes.json();
      const trackingData = await trackingRes.json();
      const paymentData = await paymentRes.json();
      

      setProduct(productData.data ?? productData);

      setTracking(trackingData.data.trackingHistory ?? []);

      setPayments(paymentData.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  console.log(product);
  
  

  if (loading) return <p>Loading...</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <>
      <DashboardHeader />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT */}

        <div className="space-y-6 lg:col-span-2">

          <Card title="Shipment Information">

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">
                  Product
                </p>

                <p className="font-semibold">
                  {product.name}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Buyer
                </p>

                <p className="font-semibold">
                  {product.buyerName}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Origin
                </p>

                <p>{product.origin}</p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Destination
                </p>

                <p>{product.destination}</p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Weight
                </p>

                <p>{product.weight} kg</p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Quantity
                </p>

                <p>{product.quantity}</p>

              </div>

            </div>

          </Card>

          <Card title="Tracking History">

            <div className="space-y-5">

              {tracking.length === 0 && (
                <p>No tracking updates.</p>
              )}

              {tracking.map((item: any) => (

                <div
                  key={item._id}
                  className="flex gap-4"
                >

                  <div className="rounded-full bg-blue-100 p-3">

                    <MapPin size={18} />

                  </div>

                  <div>

                    <p className="font-semibold">

                      {item.status}

                    </p>

                    <p className="text-sm text-slate-500">

                      {item.location}

                    </p>

                    <p className="text-xs text-slate-400">

                      {new Date(item.createdAt).toLocaleString()}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </Card>

          <Card title="Payments">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="py-3 text-left">
                    Reference
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Method
                  </th>

                  <th>
                    Status
                  </th>

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

                      {payment.method}

                    </td>

                    <td>

                      <PaymentStatusBadge
                        status={payment.status}
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </Card>

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          <Card title="Current Status">

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <Package />

                <div>

                  <p className="text-sm text-slate-500">
                    Shipment
                  </p>

                  <ProductStatusBadge
                    status={product.currentStatus}
                  />

                </div>

              </div>

              <div className="flex items-center gap-3">

                <CreditCard />

                <div>

                  <p className="text-sm text-slate-500">
                    Payment
                  </p>

                  <PaymentStatusBadge
                    status={product.paymentStatus}
                  />

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Ship />

                <div>

                  <p className="text-sm text-slate-500">
                    Shipping
                  </p>

                  <p>{product.shippingMethod}</p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Calendar />

                <div>

                  <p className="text-sm text-slate-500">
                    Created
                  </p>

                  <p>
                    {new Date(
                      product.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

              </div>

            </div>

          </Card>

          <Card title="Buyer">

            <div className="space-y-4">

              <div className="flex gap-3">

                <User />

                <div>

                  <p className="font-semibold">
                    {product.buyerName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {product.buyerEmail}
                  </p>

                </div>

              </div>

            </div>

          </Card>

          <Card title="Description">

            <p className="leading-7 text-slate-600">
              {product.description}
            </p>

          </Card>

        </div>

      </div>

    </>
  );
}