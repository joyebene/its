import Card from "@/components/shared/Card";

const timeline = [
  "Created",
  "Warehouse Received",
  "Consolidated",
  "Export Clearance",
  "In Transit",
  "Arrived Destination",
  "Customs Clearance",
  "Import Warehouse",
  "Out For Delivery",
  "Delivered",
];

interface TrackingTimelineProps {
  timeline: any[];
}


export default function TrackingTimeline({timeline}: TrackingTimelineProps) {
  return (
    <Card title="Shipment Timeline">

      <div className="space-y-5">

        {timeline.map((item, index) => (
          <div
            key={item}
            className="flex items-start gap-4"
          >
            <div className="mt-1 h-4 w-4 rounded-full bg-blue-600" />

            <div>
              <p className="font-medium">
                {item}
              </p>

              <p className="text-sm text-slate-500">
                Step {index + 1}
              </p>
            </div>

          </div>
        ))}

      </div>

    </Card>
  );
}