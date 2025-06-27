import { AppSidebar } from "@/components/app-sidebar";
import BreadcrumbForm from "@/components/form/BreadcrumbForm";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
function Dashboard() {
  return (

      <SidebarInset>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" >
             <Link to={"/admin/manage-user"}>Manage user</Link>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50" >
            <Link to={"/admin/manage-list"}>Manage List</Link>
            </div>
            <div className=" rounded-xl bg-muted/50">
              <Link to={"/admin/create-listing"}>Create Listing</Link>
            </div>

        
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
  
  );
}
export default Dashboard;
