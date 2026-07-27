import {
  FileBarChart,
  Package,
  Truck,
  CheckCircle,
} from "lucide-react";

import ReportStatCard from "@/components/shipment/ShipmentStats";
import Button from "@/components/shared/Button";

export default function ReportsPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Reports
          </h1>

          <p className="text-gray-500">
            View shipment reports and analytics
          </p>
        </div>

        <div>
          <Button className="flex items-center px-2 sm:px-3 md:px-4 gap-2">
            Generate Report
          </Button>
        </div>


      </div>

      <div className="grid md:grid-cols-4 gap-5">

        <ReportStatCard
          title="Total Shipments"
          value={120}
          icon={Package}
        />

        <ReportStatCard
          title="In Transit"
          value={45}
          icon={Truck}
        />

        <ReportStatCard
          title="Delivered"
          value={70}
          icon={CheckCircle}
        />

        <ReportStatCard
          title="Reports Generated"
          value={25}
          icon={FileBarChart}
        />

      </div>

      <div className="rounded-xl border bg-white p-6">

        <h2 className="text-xl font-semibold mb-4">
          Shipment Summary
        </h2>

        <p className="text-gray-500">
          Report charts and export options
          will be displayed here.
        </p>

      </div>

    </div>
  );
}