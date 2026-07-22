import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";
import DataTable, { TableColumn } from "@/components/shared/DataTable";

const trackingHistory = [
  {
    _id: "1",
    trackingNumber: "TRK-001",
    shipmentNumber: "SHP-001",
    status: "IN_TRANSIT",
    updatedBy: "Logistics",
  },
  {
    _id: "2",
    trackingNumber: "TRK-002",
    shipmentNumber: "SHP-002",
    status: "DELIVERED",
    updatedBy: "Delivery",
  },
];

const columns: TableColumn<(typeof trackingHistory)[number]>[] = [
  {
    key: "trackingNumber",
    title: "Tracking Number",
  },
  {
    key: "shipmentNumber",
    title: "Shipment",
  },
  {
    key: "status",
    title: "Current Status",
  },
  {
    key: "updatedBy",
    title: "Updated By",
  },
] as const;

export default function TrackingPage() {
  return (
    <div className="space-y-6">

      <PageHeader
        title="Shipment Tracking"
        description="Track shipments using tracking numbers."
      />

      <Card title="Track Shipment">

        <div className="flex flex-col gap-4 md:flex-row md:items-center">

          <Input
           label="Tracking Number"
            name="tracking"
            placeholder="Enter Tracking Number..."
          />
            <div className="md:w-fit md:mt-5">
               <Button className="px-2 sm:px-3 md:px-4">
            Track Shipment
          </Button>   
            </div>
        

        </div>

      </Card>

      <Card
        title="Recent Tracking"
        description="Recently tracked shipments."
      >

        <DataTable
          columns={columns}
          data={trackingHistory}
          resource="tracking"
          showEdit={false}
        />

      </Card>

    </div>
  );
}