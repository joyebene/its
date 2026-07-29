"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

import Logo from "../shared/Logo";
import NavItem from "./NavItem";
import Button from "../shared/Button";

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
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loggingOut, setLoggingOut] = useState(false);

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
      setLoggingOut(true);

      const token = localStorage.getItem("accessToken");

      await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setOpen(false);
      router.replace("/");
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent
        side="left"
        className="flex w-72 flex-col p-0"
      >
        <div className="border-b p-6">
          <Logo />
        </div>

        <nav className="flex-1 space-y-2 p-5">
          {filteredLinks.map((item) => (
            <div
              key={item.href}
              onClick={() => setOpen(false)}
            >
              <NavItem {...item} />
            </div>
          ))}
        </nav>

        <div className="border-t p-5 space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
            loading={loggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

          <p className="text-center text-sm text-slate-500">
            &copy; 2026 CargoXpress
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}