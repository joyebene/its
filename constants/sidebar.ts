import { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  Package,
  MapPinned,
  Container,
  ShieldCheck,
  Users,
  Settings,
  Bell,
  FileBarChart,
} from "lucide-react";

export const sidebarLinks = [
  // ===== DASHBOARDS =====
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: Object.values(UserRole), // Everyone
  },

  // ===== USERS (Admin only) =====
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
    ],
  },

  // ===== SHIPMENTS =====
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

  // Customer specific - My Shipments
  {
    title: "My Shipments",
    href: "/customers/shipments",
    icon: Package,
    roles: [UserRole.USER],
  },

  // ===== TRACKING =====
  {
    title: "Tracking",
    href: "/tracking",
    icon: MapPinned,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.LOGISTICS,
      UserRole.USER,
      UserRole.DELIVERY,
    ],
  },

  // ===== CONTAINERS =====
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

  // ===== CUSTOMS =====
  {
    title: "Customs Clearance",
    href: "/customs",
    icon: ShieldCheck,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.CUSTOMS,
    ],
  },

  // ===== REPORTS =====
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
    roles: [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.LOGISTICS,
      UserRole.CUSTOMS,
    ],
  },

  // ===== NOTIFICATIONS =====
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: Object.values(UserRole),
  },

  // ===== SETTINGS =====
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: Object.values(UserRole),
  },
];