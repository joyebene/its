import { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  Package,
  MapPinned,
  Container,
  ShieldCheck,
  Users,
  Settings,
} from "lucide-react";


export const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: Object.values(UserRole), // Everyone
  },

  {
    title: "Shipments",
    href: "/shipments",
    icon: Package,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.LOGISTICS,
      UserRole.WAREHOUSE,
    ],
  },

  {
    title: "Tracking",
    href: "/tracking",
    icon: MapPinned,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.LOGISTICS,
      UserRole.DELIVERY,
    ],
  },

  {
    title: "Containers",
    href: "/containers",
    icon: Container,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.WAREHOUSE,
      UserRole.LOGISTICS,
    ],
  },

  {
    title: "Customs",
    href: "/customs",
    icon: ShieldCheck,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.CUSTOMS,
    ],
  },

  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
    ],
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: Object.values(UserRole),
  },
];