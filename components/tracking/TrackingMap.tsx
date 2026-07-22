import Card from "@/components/shared/Card";
import { MapPinned } from "lucide-react";

export default function TrackingMap() {
  return (
    <Card title="Shipment Route">

      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed">

        <div className="text-center">

          <MapPinned
            size={50}
            className="mx-auto mb-3 text-blue-600"
          />

          <p className="text-lg font-semibold">
            Route Map
          </p>

          <p className="text-sm text-slate-500">
            Google Maps integration goes here.
          </p>

        </div>

      </div>

    </Card>
  );
}