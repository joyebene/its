import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import CustomsStatusBadge from "@/components/customs/CustomsStatusBadge";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function CustomsDetailsPage({
    params,
}: Props) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/customs/${id}`,
        {
            cache: "no-store",
            headers: {
                Cookie: "",
            },
        }
    );

    const result = await res.json();

    const customs = result.data;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Customs Details"
                description="Customs clearance information."
            />

            <Card title="Customs Information">
                <div className="grid gap-6 md:grid-cols-2">
                    <Info
                        label="Shipment"
                        value={
                            customs.shipment?.trackingNumber ?? "-"
                        }
                    />

                    <Info
                        label="Container"
                        value={
                            customs.shipment?.container?.containerNumber ??
                            "-"
                        }
                    />

                    <Info
                        label="Duty Amount"
                        value={`₦${customs.dutyAmount.toLocaleString()}`}
                    />

                    <div>
                        <p className="text-sm text-slate-500">
                            Status
                        </p>

                        <CustomsStatusBadge
                            status={customs.status}
                        />
                    </div>

                    <Info
                        label="Processed By"
                        value={
                            customs.processedBy
                                ? `${customs.processedBy.firstName} ${customs.processedBy.lastName}`
                                : "-"
                        }
                    />

                    <Info
                        label="Created Date"
                        value={new Date(
                            customs.createdAt
                        ).toLocaleDateString()}
                    />
                </div>
            </Card>

            <Card title="Remarks">
                <p className="text-slate-600">
                    {customs.remarks || "No remarks available."}
                </p>
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