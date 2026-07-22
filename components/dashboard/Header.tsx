"use client";

import {
    Bell,
    Menu,
    Search,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
    openSidebar: () => void;
}

export default function Header({
    openSidebar,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/80 px-6 backdrop-blur">

            {/* Left */}

            <div className="flex items-center gap-4">

                <button
                    onClick={openSidebar}
                    className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Dashboard
                    </h1>

                    <p className="text-sm text-slate-500">
                        Welcome back
                    </p>
                </div>

            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

                {/* Search */}

                <div className="hidden items-center rounded-xl border bg-slate-50 px-4 lg:flex">

                    <Search
                        size={18}
                        className="text-slate-400"
                    />

                    <input
                        placeholder="Search shipment..."
                        className="h-11 bg-transparent px-3 outline-none"
                    />

                </div>

                {/* Notification */}

                <button className="rounded-xl border p-3 hover:bg-slate-100">
                    <Bell size={20} />
                </button>

                {/* Avatar */}

                <Avatar className="h-11 w-11">
                    <AvatarFallback>
                        JE
                    </AvatarFallback>
                </Avatar>

            </div>

        </header>
    );
}