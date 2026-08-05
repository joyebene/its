import Card from "@/components/shared/Card";

interface TrackingLocation {
  location: string;
  status: string;
  timestamp: string;
  description?: string;
}

interface TrackingTimelineProps {
  timeline: TrackingLocation[];
}

export default function TrackingTimeline({
  timeline,
}: TrackingTimelineProps) {
  return (
    <Card title="Product Tracking History">
      {timeline.length === 0 ? (
        <p className="text-sm text-slate-500">
          No tracking updates available.
        </p>
      ) : (
        <div className="space-y-5">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div className="mt-1 h-4 w-4 rounded-full bg-blue-600" />

              <div className="flex-1">
                <p className="font-medium">
                  {item.status.replaceAll("_", " ")}
                </p>

                <p className="text-sm text-slate-500">
                  {item.location}
                </p>

                {item.description && (
                  <p className="mt-1 text-sm text-slate-600">
                    {item.description}
                  </p>
                )}

                <p className="mt-1 text-xs text-slate-400">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}