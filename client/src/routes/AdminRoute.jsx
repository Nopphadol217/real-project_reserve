import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    hydrate();
  }, []);

  // เช็คว่า Login หรือยัง
  if (!isHydrated) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  // ถ้าไม่ login หรือไม่ใช่ admin ให้ redirect ไปหน้าแรก
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
