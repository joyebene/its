"use client";

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

import Logo from "../shared/Logo";
import NavItem from "./NavItem";

import { sidebarLinks } from "@/constants/sidebar";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function MobileSidebar({
    open,
    setOpen,
}: Props) {
    return (
        <Sheet
            open={open}
            onOpenChange={setOpen}
        >
            <SheetContent
                side="left"
                className="w-72 p-0"
            >
                <div className="border-b p-6">
                    <Logo />
                </div>

                <nav className="space-y-2 p-5">

                    {sidebarLinks.map((item) => (

                        <div
                            key={item.href}
                            onClick={() => setOpen(false)}
                        >
                            <NavItem {...item} />
                        </div>

                    ))}

                </nav>

            </SheetContent>
        </Sheet>
    );
}