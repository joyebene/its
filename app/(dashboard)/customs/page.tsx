"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import DataTable, {
  TableColumn,
} from "@/components/shared/DataTable";

import CustomsStatusBadge from "@/components/customs/CustomsStatusBadge";
import { Customs } from "@/lib/types";

const columns: TableColumn<Customs>[] = [
  {
    key: "shipment",
    title: "Shipment",
    render: (row) => (
      <div>
        <p className="font-medium">
          {row.shipment?.trackingNumber ?? "-"}
        </p>
      </div>
    ),
  },

  {
    key: "container",
    title: "Container",
    render: (row) => (
      row.shipment?.container?.containerNumber ?? "-"
    ),
  },

  {
    key: "dutyAmount",
    title: "Duty Amount",
    render: (row) => (
      `₦${row.dutyAmount.toLocaleString()}`
    ),
  },

  {
    key: "status",
    title: "Status",
    render: (row) => (
      <CustomsStatusBadge
        status={row.status}
      />
    ),
  },

  {
    key: "processedBy",
    title: "Processed By",
    render: (row) =>
      row.processedBy
        ? `${row.processedBy.firstName} ${row.processedBy.lastName}`
        : "-",
  },
];

export default function CustomsPage() {
  const [customs, setCustoms] = useState<Customs[]>([]);
  const [filtered, setFiltered] = useState<Customs[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustoms();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(customs);
      return;
    }

    const keyword = search.toLowerCase();

    setFiltered(
      customs.filter((item) =>
        item.shipment?.trackingNumber
          ?.toLowerCase()
          .includes(keyword) ||
        item.shipment?.container?.containerNumber
          ?.toLowerCase()
          .includes(keyword) ||
        item.status
          .toLowerCase()
          .includes(keyword)
      )
    );
  }, [search, customs]);

  async function fetchCustoms() {
    try {
      const token =
        localStorage.getItem("accessToken");

      const res = await fetch(
        "/api/customs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setCustoms(result.data);
        setFiltered(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Customs Clearance"
        description="Manage customs inspection, duties and shipment clearance."
      >
        <Link href="/customs/create">
          <Button>
            New Customs Record
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <div className="md:w-1/2">
          <Input
            label=""
            name="search"
            placeholder="Search customs records..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={filtered}
        resource="customs"
      />

    </div>
  );
}