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
      name: "แดชบอร์ดผู้ดูแลระบบ",
      logo: Shield,
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "แดชบอร์ดหลัก",
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
        {
          title: "รายงานประจำวัน",
          url: "/admin/daily-reports",
        },
      ],
    },
    {
      title: "จัดการที่พัก",
      url: "/admin/manage-list",
      icon: Building,
      items: [
        {
          title: "เพิ่มที่พักใหม่",
          url: "/admin/create-listing",
        },
        {
          title: "รายการที่พักทั้งหมด",
          url: "/admin/manage-list",
        },
        {
          title: "ที่พักรอการอนุมัติ",
          url: "/admin/pending-listings",
        },
        {
          title: "ที่พักที่ถูกรายงาน",
          url: "/admin/reported-listings",
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
          title: "ผู้ใช้ที่ถูกระงับ",
          url: "/admin/suspended-users",
        },
        {
          title: "ขออนุมัติเป็นเจ้าของที่พัก",
          url: "/admin/host-applications",
        },
      ],
    },
    {
      title: "การจองและการเงิน",
      url: "/admin/bookings",
      icon: Calendar,
      items: [
        {
          title: "การจองทั้งหมด",
          url: "/admin/bookings",
        },
        {
          title: "การชำระเงิน",
          url: "/admin/payments",
          icon: CreditCard,
        },
        {
          title: "การคืนเงิน",
          url: "/admin/refunds",
        },
        {
          title: "รายงานการเงิน",
          url: "/admin/financial-reports",
        },
      ],
    },
    {
      title: "เครื่องมือสำหรับผู้ใช้",
      url: "/",
      icon: Home,
      items: [
        {
          title: "กลับสู่หน้าหลัก",
          url: "/",
        },
        {
          title: "ค้นหาที่พัก",
          url: "/search",
        },
        {
          title: "ติดต่อเรา",
          url: "/contact",
        },
      ],
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
