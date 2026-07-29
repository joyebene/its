"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../shared/Logo";
import NavItem from "./NavItem";
import Button from "../shared/Button";
import { LogOut } from "lucide-react";
import { sidebarLinks } from "@/constants/sidebar";
import { hasRole } from "@/lib/permissions";

export default function Sidebar() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const filteredLinks = sidebarLinks.filter((item) =>
        user ? hasRole(user.role, item.roles) : false
    );

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            router.replace("/");
        }
    };
    return (
        <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r bg-white lg:flex lg:flex-col">
            <div className="border-b p-6">
                <Logo />
            </div>

            <nav className="flex-1 space-y-2 p-5">
                {filteredLinks.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                    />
                ))}
            </nav>

            <div className="border-t p-5 space-y-4">
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>

                <p className="text-center text-sm text-slate-500">
                    &copy; 2026 CargoXpress
                </p>
            </div>
        </aside>
    );
}