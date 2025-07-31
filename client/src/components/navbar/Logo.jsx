import { Link } from "react-router";
import { Button } from "../ui/button";
import useAuthStore from "@/store/useAuthStore";

function Logo() {
  const user = useAuthStore((state) => state.user);
  return (
    <Link
      to={user?.role === "ADMIN" ? "/admin" : "/"}
      className="flex items-center"
    >
      <div className="flex items-center space-x-2">
        {/* Airbnb-style logo */}
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 1C7.163 1 0 8.163 0 17c0 8.837 7.163 16 16 16s16-7.163 16-16C32 8.163 24.837 1 16 1zm0 29C8.82 30 3 24.18 3 17S8.82 4 16 4s13 5.82 13 13-5.82 13-13 13z" />
            <path d="M21.5 12.5c0 3.038-2.462 5.5-5.5 5.5s-5.5-2.462-5.5-5.5S12.962 7 16 7s5.5 2.462 5.5 5.5z" />
          </svg>
        </div>

        {/* Brand name - ซ่อนในมือถือ */}
        <span className="hidden md:block text-xl font-bold text-red-500">
          {user?.role === "ADMIN" ? "Admin Panel" : "BookyLife"}
        </span>
      </div>
    </Link>
  );
}
export default Logo;
