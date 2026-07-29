"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    RefreshCw,
    Package,
    Truck,
    CheckCircle2,
    Clock3,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/shared/Card";
import ProductStatusBadge from "@/components/products/ProductStatusBadge";
import PaymentStatusBadge from "@/components/products/PaymentStatusBadge";
import ProductActions from "@/components/products/ProductActions";

type Product = {
    _id: string;
    name: string;
    sku?: string;
    reference?: string;
    customerName?: string;
    origin?: string;
    destination?: string;
    shippingMethod?: string;
    currentStatus: string;
    paymentStatus: string;
    weight?: number;
    createdAt: string;
};

type ProductStats = {
    total: number;
    inTransit: number;
    delivered: number;
    pendingPayment: number;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<ProductStats>({
        total: 0,
        inTransit: 0,
        delivered: 0,
        pendingPayment: 0,
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");

    async function loadProducts() {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (status) params.append("status", status);
            if (paymentStatus)
                params.append("paymentStatus", paymentStatus);

            const token = localStorage.getItem("accessToken");

            const res = await fetch(`/api/products?${params.toString()}`, {
                cache: "no-store",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch products");

            const data = await res.json();

            setProducts(data.products || data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function loadStats() {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await fetch("/api/products/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });

            if (!res.ok) return;

            const data = await res.json();

            const stats = data.data || data;

            setStats({
                total: stats.total ?? 0,
                inTransit: stats.inTransit ?? 0,
                delivered: stats.delivered ?? 0,
                pendingPayment: stats.pendingPayment ?? 0,
            });
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadProducts();
    }, [search, status, paymentStatus]);

    useEffect(() => {
        loadStats();
    }, []);

    async function refresh() {
        setRefreshing(true);

        await Promise.all([
            loadProducts(),
            loadStats(),
        ]);

        setRefreshing(false);
    }

    const filteredProducts = useMemo(() => products, [products]);

    console.log(stats);


    return (
        <>
            <DashboardHeader />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Products"
                    value={stats.total.toString()}
                    change="Registered"
                    icon={Package}
                />

                <StatCard
                    title="In Transit"
                    value={stats.inTransit.toString()}
                    change="Shipping"
                    icon={Truck}
                />

                <StatCard
                    title="Delivered"
                    value={stats.delivered.toString()}
                    change="Completed"
                    icon={CheckCircle2}
                />

                <StatCard
                    title="Pending Payment"
                    value={stats.pendingPayment.toString()}
                    change="Awaiting"
                    icon={Clock3}
                />

            </div>

            <Card
                title="Products"
                className="mt-6"
            >

                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex flex-1 items-center gap-3">

                        <div className="relative w-full max-w-md">

                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                            />

                        </div>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-slate-200 px-4 py-3"
                        >
                            <option value="">All Status</option>
                            <option value="created">Created</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="shipping">Shipping</option>
                            <option value="customs">Customs</option>
                            <option value="delivered">Delivered</option>
                        </select>

                        <select
                            value={paymentStatus}
                            onChange={(e) =>
                                setPaymentStatus(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 px-4 py-3"
                        >
                            <option value="">Payment</option>
                            <option value="pending">Pending</option>
                            <option value="cleared">Cleared</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>

                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={refresh}
                            className="flex items-center gap-2 rounded-xl border px-4 py-3 hover:bg-slate-100"
                        >
                            <RefreshCw
                                size={18}
                                className={refreshing ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>

                        <Link
                            href="/products/create"
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            New Product
                        </Link>

                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead>

                            <tr className="border-b text-left text-sm text-slate-500">

                                <th className="py-4">Reference</th>
                                <th>Name</th>
                                <th>Customer</th>
                                <th>Shipping</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Created</th>
                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="py-20 text-center text-slate-500"
                                    >
                                        Loading products...
                                    </td>

                                </tr>

                            ) : filteredProducts.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="py-20 text-center text-slate-500"
                                    >
                                        No products found.
                                    </td>

                                </tr>

                            ) : (

                                filteredProducts.map((product) => (

                                    <tr
                                        key={product._id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="py-5 font-medium">
                                            {product.reference || "-"}
                                        </td>

                                        <td>{product.name}</td>

                                        <td>{product.customerName}</td>

                                        <td>{product.shippingMethod}</td>

                                        <td>

                                            <ProductStatusBadge
                                                status={product.currentStatus}
                                            />

                                        </td>

                                        <td>
                                            <PaymentStatusBadge
                                                status={product.paymentStatus}
                                            />
                                        </td>

                                        <td>
                                            {new Date(
                                                product.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>

                                            <ProductActions
                                                id={product._id}
                                                onDeleted={loadProducts}
                                            />

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </Card>
        </>
    );
}