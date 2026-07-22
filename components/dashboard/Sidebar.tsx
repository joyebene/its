import { UserRole } from "@/lib/types";
import Logo from "../shared/Logo";
import NavItem from "./NavItem";
import { sidebarLinks } from "@/constants/sidebar";
import { hasRole } from "@/lib/permissions";

export default function Sidebar() {

    const filteredLinks = sidebarLinks.filter((item) =>
        hasRole(UserRole.ADMIN, item.roles)
    );

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

            <div className="border-t p-5 text-sm text-slate-500">
                &copy; 2026 CargoXpress
            </div>

        </aside>
    );
}