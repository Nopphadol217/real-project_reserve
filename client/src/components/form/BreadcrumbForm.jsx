import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  const pathParts = pathname.split("/").filter(Boolean);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathParts.map((part, index) => {
          const href = "/" + pathParts.slice(0, index + 1).join("/");
          const label = BREADCRUMB_LABELS[part] || part;

          const isLast = index === pathParts.length - 1;

          return (
            <div key={href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbPage className="capitalize">
                    <BreadcrumbLink asChild>
                      <Link to={href} className="capitalize hover:underline">
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
