import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router";
import PageIllustration from "@/pages/page-illustration";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import HeaderTigger from "./HeaderTigger";
import { DayPickerProvider } from "react-day-picker";
function Layout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [isHydrated]);

  return (
      <DayPickerProvider initialProps={{ mode: "single" }}>

      <div className="container">
        <Toaster position="bottom-right" />
        <Navbar />

        <Outlet />
      </div>
      </DayPickerProvider>

  );
}
export default Layout;
