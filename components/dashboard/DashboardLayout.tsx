"use client";

import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children,
}: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">

            <Sidebar />

            <MobileSidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
            />

            <div className="lg:ml-72">

                <Header
                    openSidebar={() => setSidebarOpen(true)}
                />

                <main className="p-6">
                    {children}
                </main>

            </div>

        </div>
    );
}