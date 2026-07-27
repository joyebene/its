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

import ContainerStatusBadge from "@/components/container/ContainerStatusBadge";

interface Container {
  _id: string;
  containerNumber: string;
  type: string;
  carrier: string;
  shipmentCount: number;
  expectedArrival?: string;
  status:
    | "AVAILABLE"
    | "LOADED"
    | "IN_TRANSIT"
    | "ARRIVED";
}

const columns: TableColumn<Container>[] = [
  {
    key: "containerNumber",
    title: "Container",
  },
  {
    key: "type",
    title: "Type",
  },
  {
    key: "carrier",
    title: "Carrier",
  },
  {
    key: "shipmentCount",
    title: "Shipments",
  },
  {
    key: "expectedArrival",
    title: "Arrival",
    render: (row) =>
      row.expectedArrival
        ? new Date(row.expectedArrival).toLocaleDateString()
        : "-",
  },
  {
    key: "status",
    title: "Status",
    render: (row) => (
      <ContainerStatusBadge status={row.status} />
    ),
  },
];

export default function ContainersPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchContainers();
  }, []);

  async function fetchContainers() {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch("/api/containers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setContainers(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch containers", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredContainers = containers.filter(
    (container) =>
      container.containerNumber
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      container.carrier
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      container.type
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <PageHeader
        title="Containers"
        description="Manage shipping containers."
      >
        <Link href="/containers/create">
          <Button>
            New Container
          </Button>
        </Link>
      </PageHeader>

      <Card>
        <div className="md:w-1/2">
          <Input
            label=""
            name="search"
            placeholder="Search containers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={filteredContainers}
        resource="containers"
      />

    </div>
  );
}