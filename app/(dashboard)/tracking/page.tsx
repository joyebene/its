"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import DataTable, {
  TableColumn,
} from "@/components/shared/DataTable";
import Badge from "@/components/shared/Badge";


type Product = {
  _id: string;
  name: string;
  sku: string;
  currentStatus: string;

  shipmentId?: {
    _id: string;
    shipmentNumber: string;
    trackingNumber: string;
  };

  buyerId?: {
    firstName: string;
    lastName: string;
  };

  buyerName?: string;

  currentLocation?: {
    latitude: number;
    longitude: number;
    updatedAt: string;
  };
};

export default function TrackingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        "/api/products?hasShipment=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setProducts(result.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns: TableColumn<Product>[] = [
    {
      key: "name",
      title: "Product",
    },
    {
      key: "sku",
      title: "SKU",
    },
    {
      key: "shipmentId",
      title: "Shipment",
      render: (item) =>
        item.shipmentId?.shipmentNumber ?? "-",
    },
    {
      key: "shipmentId",
      title: "Tracking Number",
      render: (item) =>
        item.shipmentId?.trackingNumber ?? "-",
    },
    {
      key: "buyerId",
      title: "Buyer",
      render: (item) =>
        item.buyerName
          ? `${item.buyerName}`
          : "-",
    },
    {
      key: "currentStatus",
      title: "Status",
      render: (item) => (
        <Badge>
          {item.currentStatus.replaceAll("_", " ")}
        </Badge>
      ),
    },
    {
      key: "currentLocation",
      title: "GPS",
      render: (item) =>
        item.currentLocation
          ? "📍 Available"
          : "Not Started",
    }
  ];

  return (
    <div className="space-y-6">

      <PageHeader
        title="Shipment Tracking"
        description="Manage shipment GPS tracking and monitor product movement."
      />

      <Card
        title="Products Ready For Tracking"
        description="Only products that have an associated shipment are displayed."
      >
        <DataTable
          columns={columns}
          data={products}
          resource="tracking"
          showEdit={false}
        />
      </Card>

    </div>
  );
}