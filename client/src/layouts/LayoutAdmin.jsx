
import Navbar from "@/components/navbar/Navbar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import useAuthStore from "@/store/useAuthStore";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import HeaderTigger from "./HeaderTigger";
import { AppSidebar } from "@/components/app-sidebar";

function LayoutAdmin() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="w-full ">
      
        <HeaderTigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
export default LayoutAdmin;
