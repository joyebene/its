"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Card from "@/components/shared/Card";

export default function CreateProductPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",

        quantity: 1,
        unitPrice: 0,

        buyerName: "",
        buyerEmail: "",

        city: "",
        state: "",
        country: "",
        street: "",
        postalCode: "",
    });

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement
        >
    ) {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                name === "quantity" ||
                name === "unitPrice"
                    ? Number(value)
                    : value,
        }));
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            setLoading(true);

            const token =
                localStorage.getItem("accessToken");

            const payload = {
                name: form.name,
                description: form.description,

                quantity: form.quantity,
                unitPrice: form.unitPrice,
                totalPrice:
                    form.quantity *
                    form.unitPrice,

                buyerName: form.buyerName,
                buyerEmail: form.buyerEmail,

                shippingAddress: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    country: form.country,
                    postalCode: form.postalCode,
                },
            };

            console.log(payload);

            const res = await fetch(
                "/api/products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.log(data);
                alert(data.message);
                return;
            }

            alert("Product created successfully.");

            router.push("/products");
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <DashboardHeader />

            <Card title="Create Product">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <label>Product Name</label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>Buyer Name</label>

                            <input
                                name="buyerName"
                                value={form.buyerName}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>Buyer Email</label>

                            <input
                                type="email"
                                name="buyerEmail"
                                value={form.buyerEmail}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>Quantity</label>

                            <input
                                type="number"
                                min={1}
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>Unit Price ($)</label>

                            <input
                                type="number"
                                min={0}
                                name="unitPrice"
                                value={form.unitPrice}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>Total Price</label>

                            <input
                                disabled
                                value={
                                    form.quantity *
                                    form.unitPrice
                                }
                                className="w-full border rounded-xl bg-slate-100 p-3"
                            />
                        </div>

                        <div>
                            <label>Street</label>

                            <input
                                name="street"
                                value={form.street}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>City</label>

                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>State</label>

                            <input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>Country</label>

                            <input
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label>Postal Code</label>

                            <input
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                    </div>

                    <div>
                        <label>Description</label>

                        <textarea
                            rows={5}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3"
                        />
                    </div>

                    <div className="flex justify-end gap-4">

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="border rounded-xl px-5 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white rounded-xl px-5 py-3"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Product"}
                        </button>

                    </div>

                </form>
            </Card>
        </>
    );
}