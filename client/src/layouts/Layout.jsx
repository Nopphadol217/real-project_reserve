import Navbar from "@/components/navbar/Navbar";
import { Outlet } from "react-router";

import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

import HeaderTigger from "./HeaderTigger";
function Layout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, [isHydrated]);

  return (
    <div>
 



      <Navbar />
      <Outlet />
    </div>
  );
}
export default Layout;
