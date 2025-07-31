import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router";
import PageIllustration from "@/pages/page-illustration";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import HeaderTigger from "./HeaderTigger";
function Layout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [isHydrated]);

  return (
    <div>
      <Toaster position="bottom-right" />

      {/* เพิ่ม padding-top เพื่อไม่ให้เนื้อหาทับกับ navbar 
          Main navbar (16) + Second navbar (จากการคำนวณประมาณ 20) = 36 = pt-36
          ปรับให้เหมาะสมกับความสูงจริง */}

      <Navbar />
      <Outlet />
    </div>
  );
}
export default Layout;
