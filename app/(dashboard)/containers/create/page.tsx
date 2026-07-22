import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

export default function CreateContainerPage() {
  return (
    <div className="space-y-6">

      <PageHeader
        title="Create Container"
        description="Register a new shipping container."
      />

      <Card>

        <form className="grid gap-5 md:grid-cols-2">

          <Input
            label="Container Number"
            name="containerNumber"
          />

          <Input
            label="Carrier"
            name="carrier"
          />

          <Input
            label="Container Type"
            name="type"
          />

          <Input
            label="Origin Port"
            name="originPort"
          />

          <Input
            label="Destination Port"
            name="destinationPort"
          />

          <Input
            type="date"
            label="Expected Arrival"
            name="arrival"
          />

          <div className="md:col-span-2">
            <Button>
              Save Container
            </Button>
          </div>

        </form>

      </Card>

    </div>
  );
}