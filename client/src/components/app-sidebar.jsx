import * as React from "react";
import {
  Home,
  Search,
  Heart,
  Calendar,
  User,
  MapPin,
  Building,
  Settings,
  HelpCircle,
  Phone,
  Plus,
  List,
  Users,
  Shield,
  BarChart3,
  CreditCard,
  FileText,
  Bell,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "ผู้ดูแลระบบ",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "แดชบอร์ดผู้จัดการ",
      logo: Shield,
      plan: "Management Panel",
    },
  ],
  navMain: [
    {
      title: "แดชบอร์ด",
      url: "/admin/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "ภาพรวมระบบ",
          url: "/admin/dashboard",
        },
        {
          title: "สถิติการใช้งาน",
          url: "/admin/analytics",
        },
      ],
    },
    {
      title: "จัดการที่พัก",
      url: "/admin/manage-list",
      icon: Building,
      items: [
        {
          title: "รายการที่พักทั้งหมด",
          url: "/admin/manage-list",
        },
        {
          title: "เพิ่มที่พักใหม่",
          url: "/admin/create-listing",
        },
        {
          title: "ที่พักรอการอนุมัติ",
          url: "/admin/pending-listings",
        },
      ],
    },
    {
      title: "จัดการการจอง",
      url: "/admin/bookings",
      icon: Calendar,
      items: [
        {
          title: "การจองทั้งหมด",
          url: "/admin/bookings",
        },
        {
          title: "รอการยืนยัน",
          url: "/admin/pending-bookings",
        },
        {
          title: "การจองวันนี้",
          url: "/admin/today-bookings",
        },
      ],
    },
    {
      title: "จัดการการชำระเงิน",
      url: "/admin/payments",
      icon: CreditCard,
      items: [
        {
          title: "รายการชำระเงิน",
          url: "/admin/payments",
        },
        {
          title: "รอการตรวจสอบ",
          url: "/admin/pending-payments",
        },
        {
          title: "ประวัติการชำระ",
          url: "/admin/payment-history",
        },
      ],
    },
    {
      title: "จัดการผู้ใช้งาน",
      url: "/admin/manage-user",
      icon: Users,
      items: [
        {
          title: "ผู้ใช้งานทั้งหมด",
          url: "/admin/manage-user",
        },
        {
          title: "เจ้าของที่พัก",
          url: "/admin/hosts",
        },
        {
          title: "ลูกค้า",
          url: "/admin/customers",
        },
      ],
    },
  ],
  projects: [
    {
      name: "หน้าหลัก",
      url: "/",
      icon: Home,
    },
    {
      name: "ค้นหาที่พัก",
      url: "/search",
      icon: Search,
    },
    {
      name: "รายการโปรด",
      url: "/favorites",
      icon: Heart,
    },
    {
      name: "การจองของฉัน",
      url: "/user/my-orders",
      icon: Calendar,
    },
    {
      name: "โปรไฟล์",
      url: "/user/profile",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
