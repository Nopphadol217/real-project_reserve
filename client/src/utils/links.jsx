import {
  ChartNoAxesGantt,
  Heart,
  Home,
  LayoutDashboard,
  Search,
  Send,
  UserCog,
  UserRoundPen,
} from "lucide-react";
import EditRoadOutlinedIcon from '@mui/icons-material/EditRoadOutlined';
export const publicLinks = [
  {
    icon: Home ,
    href: "/",
    label: "ที่พักของฉัน",
  },
  {
    icon: Search ,
    href: "/about",
    label: "ค้นหาที่พัก",
  },
  {
    icon: EditRoadOutlinedIcon ,
    href: "/service",
    label: "ทริป",
  },
  {
    icon: Heart ,
    href: "/contact",
    label: "รายการโปรด",
  },
];

export const privateLinks = [
  {
    href: "/user/profile",
    label: "แอคเคาท์ของฉัน",
  },
  {
    href: "/user/myfavorite",
    label: "ตัวเลือกถูกใจ",
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
