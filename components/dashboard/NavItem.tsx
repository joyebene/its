"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
    title: string;
    href: string;
    icon: LucideIcon;
}

export default function NavItem({
    title,
    href,
    icon: Icon,
}: NavItemProps) {
    const pathname = usePathname();

    // Exact match or child route
    const isActive =
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
        >
            <Icon size={20} />
            <span className="font-medium">{title}</span>
        </Link>
    );
}