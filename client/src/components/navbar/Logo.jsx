import { Link } from "react-router";
import { Button } from "../ui/button";
import useAuthStore from "@/store/useAuthStore";

function Logo() {
  const user = useAuthStore((state) => state.user);
  return (
    <Link
      to={user?.role === "ADMIN" ? "/admin" : "/"}
      className="flex items-center hover:opacity-90 transition-opacity duration-200"
    >
      <div className="flex items-center space-x-3">
        {/* Logo Container */}
        <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-md p-1.5">
          <img
            src="/logo/bookylife_logo.png"
            alt="BookyLife Logo"
            className="w-full h-full object-contain filter brightness-0 invert"
          />
        </div>

        {/* Brand name - ซ่อนในมือถือ */}
        <div className="hidden md:block">
          <span className="text-xl font-bold text-[#FFEED4] tracking-tight">
            {user?.role === "ADMIN" ? "Admin Panel" : "BookyLife"}
          </span>
          <div className="text-xs text-[#FFEED4]/80 -mt-1">
            {user?.role === "ADMIN" ? "ระบบจัดการ" : "จองที่พักง่ายๆ"}
          </div>
        </div>
      </div>
    </Link>
  );
}
export default Logo;
