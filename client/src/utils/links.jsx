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
  BarChart3,
  Building2,
  DollarSign,
  Clock,
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
    href: "/user/pending-payment",
    label: "รอชำระเงิน",
    icon: <Clock />,
  },
  {
    href: "/user/mybookings",
    label: "การจองของฉัน",
    icon: <Calendar />,
  },
  {
    href: "/user/my-orders",
    label: "ประวัติการจอง",
    icon: <Star />,
  },
  {
    href: "/user/my-favorites",
    label: "รายการโปรด",
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
    href: "/admin/analytics",
    label: "Analytics (สถิติและการวิเคราะห์)",
    icon: <BarChart3 />,
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

export const businessLinks = [
  {
    href: "/business/dashboard",
    label: "Business Dashboard (แดชบอร์ดธุรกิจ)",
    icon: <LayoutDashboard />,
  },
  {
    href: "/business/places",
    label: "My Properties (ที่พักของฉัน)",
    icon: <Building2 />,
  },
  {
    href: "/business/bookings",
    label: "Booking Management (จัดการการจอง)",
    icon: <CalendarCheck />,
  },
  {
    href: "/business/payments",
    label: "Revenue Management (จัดการรายได้)",
    icon: <DollarSign />,
  },
  {
    href: "/business/analytics",
    label: "Business Analytics (สถิติธุรกิจ)",
    icon: <BarChart3 />,
  },
];
