import Card from "@/components/shared/Card";
import PageHeader from "@/components/shared/PageHeader";

export default function ContainerDetailsPage() {
  return (
    <div className="space-y-6">

      <PageHeader
        title="Container Details"
        description="Container information."
      />

      <Card title="Container Information">

        <div className="grid gap-6 md:grid-cols-2">

          <Info
            label="Container Number"
            value="MSKU1234567"
          />

          <Info
            label="Carrier"
            value="Maersk"
          />

          <Info
            label="Container Type"
            value="40FT"
          />

          <Info
            label="Origin"
            value="Shanghai"
          />

          <Info
            label="Destination"
            value="Lagos"
          />

          <Info
            label="Status"
            value="IN TRANSIT"
          />

        </div>

      </Card>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-semibold">
        {value}
      </p>
    </div>
  );
}