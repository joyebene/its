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

  expectedArrival: string;

  status:
    | "AVAILABLE"
    | "LOADED"
    | "IN_TRANSIT"
    | "ARRIVED";
}

const containers: Container[] = [
  {
    _id: "1",
    containerNumber: "MSKU1234567",
    type: "40FT",
    carrier: "Maersk",
    shipmentCount: 24,
    expectedArrival: "2026-07-30",
    status: "IN_TRANSIT",
  },
  {
    _id: "2",
    containerNumber: "OOLU8877665",
    type: "20FT",
    carrier: "MSC",
    shipmentCount: 12,
    expectedArrival: "2026-07-25",
    status: "ARRIVED",
  },
];

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
  },
  {
    key: "status",
    title: "Status",
    render: (row) => (
      <ContainerStatusBadge
        status={row.status}
      />
    ),
  },
];

export default function ContainersPage() {
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
        />   
        </div>
       

      </Card>

      <DataTable
        columns={columns}
        data={containers}
        resource="containers"
      />

    </div>
  );
}