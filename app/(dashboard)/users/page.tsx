import Link from "next/link";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

import DataTable, {
    TableColumn,
} from "@/components/shared/DataTable";

import Badge from "@/components/shared/Badge";

import { User } from "@/lib/types";


const users: User[] = [

    {
        _id: "1",
        name: "John Admin",
        email: "admin@cargo.com",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: "2026-07-22"
    },

    {
        _id: "2",
        name: "Mike Driver",
        email: "driver@cargo.com",
        role: "DELIVERY",
        status: "ACTIVE",
        createdAt: "2026-07-20"
    }

];



const columns: TableColumn<User>[] = [


    {
        key: "name",
        title: "Name"
    },


    {
        key: "email",
        title: "Email"
    },


    {
        key: "role",
        title: "Role"
    },


    {
        key: "status",
        title: "Status",

        render: (row) => (
            <Badge
                color={
                    row.status === "ACTIVE"
                        ? "green"
                        : "red"
                }
            >
                {row.status}
            </Badge>
        )
    },


    {
        key: "createdAt",
        title: "Joined"
    }

];




export default function UsersPage() {

    return (

        <div className="space-y-6">


            <PageHeader

                title="Users"

                description="Manage system users and roles."
            />



            <Card>

                <div className="md:w-1/2">

                    <Input

                        label=""

                        name="search"

                        placeholder="Search users..."

                    />

                </div>

            </Card>



            <DataTable

                columns={columns}

                data={users}

                resource="users"

            />


        </div>

    )

}