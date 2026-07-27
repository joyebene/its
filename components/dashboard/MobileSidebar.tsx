"use client";

import { useEffect, useState } from "react";

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

import Logo from "../shared/Logo";
import NavItem from "./NavItem";

import { sidebarLinks } from "@/constants/sidebar";
import { hasRole } from "@/lib/permissions";


interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}


export default function MobileSidebar({
    open,
    setOpen,
}: Props) {


    const [user, setUser] = useState<any>(null);



    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");


        if (storedUser) {

            setUser(
                JSON.parse(storedUser)
            );

        }

    }, []);




    const filteredLinks =
        sidebarLinks.filter((item) =>
            user
                ? hasRole(
                    user,
                    item.roles
                )
                : false
        );



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


                    {filteredLinks.map((item) => (

                        <div
                            key={item.href}
                            onClick={() =>
                                setOpen(false)
                            }
                        >

                            <NavItem
                                {...item}
                            />

                        </div>

                    ))}


                </nav>


            </SheetContent>

        </Sheet>

    );

}