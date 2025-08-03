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
} from "lucide-react";
export const publicLinks = [
  {
    icon: <Home />,
    href: "/",
    label: "หน้าหลัก",
  },
  {
    icon: <Search />,
    href: "/search",
    label: "ค้นหาที่พัก",
  },
];

export const userLinks = [
  {
    icon: <Search />,
    href: "/search",
    label: "ค้นหาที่พัก",
  },
  {
    icon: <Star />,
    href: "/user/favorites",
    label: "รายการโปรด",
  },
  {
    icon: <Calendar />,
    href: "/user/mybookings",
    label: "การจองของฉัน",
  },

];

export const privateLinks = [
  {
    href: "/user/profile",
    label: "แอคเคาท์ของฉัน",
    icon: <UserRoundPen />,
  },
  {
    href: "/user/mybookings",
    label: "My Bookings (ที่จองไว้)",
    icon: <Calendar />,
  },
  {
    href: "/user/favorites",
    label: "Favorites (ที่ถูกใจไว้)",
    icon: <Star />,
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
];
