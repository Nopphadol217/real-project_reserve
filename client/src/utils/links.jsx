import {
  ChartNoAxesGantt,
  Heart,
  Home,
  LayoutDashboard,
  Search,
  Send,
  UserCog,
  UserRoundPen,
  Calendar,
  Star,
  CreditCard,
  CalendarCheck,
} from "lucide-react";
import { GoSearch } from "react-icons/go";
export const publicLinks = [
  {
    icon: <Home />,
    href: "/",
    label: "หน้าหลัก",
  },
  {
    icon: <GoSearch />,
    href: "/search-places",
    label: "ค้นหาที่พัก",
  },
];

export const userLinks = [
  {
    icon: <GoSearch />,
    href: "/search-places",
    label: "ค้นหาที่พัก",
  },
];

export const privateLinks = [
  {
    href: "/user/mybookings",
    label: "การจองของฉัน",
    icon: <Calendar />,
  },
  {
    href: "/user/myorder",
    label: "ประวัติการจอง",
    icon: <Heart />,
  },
];

export const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard (แดชบอร์ด)",
    icon: <LayoutDashboard />,
  },
  {
    href: "/admin/profile",
    label: "My Profile (แอคเคาท์ของฉัน)",
    icon: <UserRoundPen />,
  },
  {
    href: "/admin/create-listing",
    label: "Create Listing (สร้างลิสต์)",
    icon: <ChartNoAxesGantt />,
  },
  {
    href: "/admin/manage-list",
    label: "Manage List (จัดการลิสต์)",
    icon: <ChartNoAxesGantt />,
  },
  {
    href: "/admin/manage-user",
    label: "Manage Users (จัดการผู้ใช้)",
    icon: <UserCog />,
  },
  {
    href: "/admin/payments",
    label: "Payment Management (จัดการการชำระเงิน)",
    icon: <CreditCard />,
  },
  {
    href: "/admin/bookings",
    label: "Booking Management (จัดการการจองทั้งหมด)",
    icon: <CalendarCheck />,
  },
];
