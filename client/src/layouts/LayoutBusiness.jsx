import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/ui/Footer";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { Outlet } from "react-router";
import HeaderTigger from "./HeaderTigger";
import { BusinessSidebar } from "@/components/sidebar/business-sidebar";

function LayoutBusiness() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <SidebarProvider>
      <BusinessSidebar />

      <div className="w-full min-h-screen flex flex-col">
        <HeaderTigger />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer variant="minimal" />
      </div>
    </SidebarProvider>
  );
}

export default LayoutBusiness;
