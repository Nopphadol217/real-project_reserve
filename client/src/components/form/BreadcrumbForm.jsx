import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useAuthStore from "@/store/useAuthStore";
import { Link, useLocation } from "react-router";

const BREADCRUMB_LABELS = {
  admin: "admin",
  dashboard: "dashboard",
  edit: "edit",
  users: "user",
  profile: "profile",
  // เพิ่มได้ตาม route ที่คุณมี
};

function BreadcrumbForm() {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const pathParts = pathname.split("/").filter(Boolean);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathParts.map((part, index) => {
          const hrefAdmin = "/admin/dashboard";
          const hrefBusiness = "/business/dashboard";
          const label = BREADCRUMB_LABELS[part] || part;

          const isLast = index === pathParts.length - 1;

          return (
            <div key={hrefAdmin} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbPage className="capitalize">
                    <BreadcrumbLink asChild>
                      <Link
                        to={user.role === "ADMIN" ? hrefAdmin : hrefBusiness}
                        className="capitalize hover:underline"
                      >
                        {label}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default BreadcrumbForm;
