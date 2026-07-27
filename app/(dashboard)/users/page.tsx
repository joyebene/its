"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/shared/PageHeader";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import DataTable, {
    TableColumn,
} from "@/components/shared/DataTable";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";

import { User } from "@/lib/types";

const columns: TableColumn<User>[] = [
    {
        key: "name",
        title: "Name",
    },
    {
        key: "email",
        title: "Email",
    },
    {
        key: "role",
        title: "Role",
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
        ),
    },
    {
        key: "createdAt",
        title: "Joined",
        render: (row) =>
            new Date(row.createdAt).toLocaleDateString(),
    },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await fetch("/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();

            if (res.ok) {
                const formattedUsers = result.data.map((user: any) => ({
                    ...user,
                    name: `${user.firstName} ${user.lastName}`,
                }));

                setUsers(formattedUsers);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Users"
                description="Manage system users and roles."
                action={
                    <Link href="/users/create">
                        <Button>Add User</Button>
                    </Link>
                }
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
    );
}