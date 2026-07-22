import Badge from "@/components/shared/Badge";


interface Props {
    status:
    | "PENDING"
    | "UNDER_INSPECTION"
    | "DUTY_PENDING"
    | "DUTY_PAID"
    | "CLEARED";
}


export default function CustomsStatusBadge({
    status,
}: Props) {

    const config = {

        PENDING: {
            label: "Pending",
            color: "gray",
        },

        UNDER_INSPECTION: {
            label: "Under Inspection",
            color: "blue",
        },

        DUTY_PENDING: {
            label: "Duty Pending",
            color: "yellow",
        },

        DUTY_PAID: {
            label: "Duty Paid",
            color: "green",
        },

        CLEARED: {
            label: "Cleared",
            color: "green",
        },

    }[status];


    return (
        <Badge color={config.color as any}>
            {config.label}
        </Badge>
    );
}