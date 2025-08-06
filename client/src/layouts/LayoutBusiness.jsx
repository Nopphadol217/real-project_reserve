import { SidebarProvider } from "@/components/ui/sidebar";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { Outlet } from "react-router";
import HeaderTigger from "./HeaderTigger";
import { BusinessSidebar } from "@/components/business-sidebar";

function LayoutBusiness() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <SidebarProvider>
      <BusinessSidebar />

      <div className="w-full">
        <HeaderTigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}

export default LayoutBusiness;
