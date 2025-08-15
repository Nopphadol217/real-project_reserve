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

        {/* Brand name - ซ่อนในมือถือ */}
        <div className="">
          <span className="text-xl font-bold text-[#FFEED4] tracking-tight">
            {user?.role === "ADMIN" ? (
              "Admin Panel"
            ) : (
              <>
                <img
                  src="/logo/bookylife.png"
                  alt="BookyLife Logo"
                  className="w-[100px] sm:w-[100px] md:w-[125px] xl:w-[150px]  object-contain filter rounded-md  "
                />
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
export default Logo;
