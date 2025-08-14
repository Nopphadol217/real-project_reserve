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
  Plus,
  List,
  Shield,
  BarChart3,
  CreditCard,
  FileText,
  Bell,
  MessageSquare,
  TrendingUp,
  Building2,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import useAuthStore from "@/store/useAuthStore";

export function BusinessSidebar({ ...props }) {
  const user = useAuthStore((state) => state.user);

  // Business sidebar data
  const businessData = {
    user: {
      name:
        `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
        "ผู้ประกอบการ",
      email: user?.email || "business@example.com",
      avatar: "/avatars/business.jpg",
    },
    teams: [
      {
        name: "แดชบอร์ดธุรกิจ",
        logo: Building2,
        plan: "Business Panel",
      },
    ],
    navMain: [
      {
        title: "แดชบอร์ด",
        url: "/business/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "ภาพรวมธุรกิจ",
            url: "/business/dashboard",
          },
        ],
      },
      {
        title: "จัดการที่พัก",
        url: "/business/places",
        icon: Building,
        items: [
          {
            title: "เพิ่มที่พักใหม่",
            url: "/business/create-listing",
          },
          {
            title: "แก้ไขที่พัก",
            url: "/business/edit-places",
          },
        ],
      },
      {
        title: "จัดการการจอง",
        url: "/business/bookings",
        icon: Calendar,
        items: [
          {
            title: "การจองทั้งหมด",
            url: "/business/bookings",
          },
        ],
      },
      {
        title: "จัดการการชำระเงิน",
        url: "/business/payments",
        icon: CreditCard,
        items: [
          {
            title: "รายได้และเงินรับ",
            url: "/business/payments",
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
        url: "/search-places",
        icon: Search,
      },
      {
        name: "โปรไฟล์",
        url: "/business/profile",
        icon: User,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={businessData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={businessData.navMain} />
        <NavProjects projects={businessData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={businessData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
