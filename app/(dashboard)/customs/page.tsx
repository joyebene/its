import Link from "next/link";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import DataTable, {
    TableColumn,
} from "@/components/shared/DataTable";

import CustomsStatusBadge from "@/components/customs/CustomsStatusBadge";
import { Customs, CustomsStatus } from "@/lib/types";


const customs: Customs[] = [

    {
        _id: "1",

        shipment: {
            _id: "ship1",
            trackingNumber: "SHP-1001",
            containerNumber: "MSKU1234567",
        },

        status: CustomsStatus.DUTY_PENDING,

        dutyAmount: 250000,

        remarks: "Awaiting customs duty payment",

        processedBy: {
            name: "Admin"
        },

        createdAt: "2026-07-22"
    },


    {
        _id: "2",

        shipment: {
            _id: "ship2",
            trackingNumber: "SHP-1002",
            containerNumber: "OOLU8877665",
        },

        status: CustomsStatus.CLEARED,

        dutyAmount: 450000,

        remarks: "Shipment cleared successfully",

        processedBy: {
            name: "John"
        },

        createdAt: "2026-07-20"
    }

];

const columns: TableColumn<Customs>[] = [

    {
        key: "shipment",
        title: "Shipment",

        render: (row) => (
            <div>
                <p className="font-medium">
                    {row.shipment.trackingNumber}
                </p>
            </div>
        )
    },


    {
        key: "containerNumber",
        title: "Container",

        render: (row) => (
            row.shipment.containerNumber ?? "-"
        )
    },


    {
        key: "dutyAmount",
        title: "Duty Amount",

        render: (row) => (
            `₦${row.dutyAmount.toLocaleString()}`
        )
    },


    {
        key: "status",
        title: "Status",

        render: (row) => (
            <CustomsStatusBadge
                status={row.status}
            />
        )
    },


    {
        key: "processedBy",
        title: "Processed By",

        render: (row) => (
            row.processedBy?.name ?? "-"
        )
    }

];


export default function CustomsPage() {


    return (

        <div className="space-y-6">


            <PageHeader

                title="Customs Clearance"

                description="Manage customs inspection, duties and shipment clearance."

            >

                <Link href="/customs/create">

                    <Button>
                        New Customs Record
                    </Button>

                </Link>

            </PageHeader>



            <Card>

                <div className="md:w-1/2">

                    <Input

                        label=""

                        name="search"

                        placeholder="Search customs records..."

                    />

                </div>


            </Card>




            <DataTable

                columns={columns}

                data={customs}

                resource="customs"

            />



        </div>

    );

}