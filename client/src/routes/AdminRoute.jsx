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
       <div className="flex gap-6">
      {/* Sidebar Skeleton */}
      <aside className="w-64 space-y-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-full rounded-md"
            />
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[180px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
        ))}
      </main>
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
