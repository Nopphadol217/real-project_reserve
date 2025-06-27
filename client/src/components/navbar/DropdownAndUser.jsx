import useAuthStore from "@/store/useAuthStore";
import DropdownListMenu from "./DropdownListMenu";
import { AlignLeft, LogIn, UserIcon } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import ProfileButton from "@/pages/user/profile/ProfileButton";

function DropdownAndUser() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center gap-2">
      {!user ? (
        <>
          {/* ✅ สำหรับจอใหญ่ (md ขึ้นไป) แสดงปุ่มเต็ม */}
          <div className="hidden md:flex gap-2">
            <Button>
              <Link to="/login">Login</Link>
            </Button>
            <Button>
              <Link to="/register">Register</Link>
            </Button>
          </div>

          {/* ✅ สำหรับจอเล็ก (sm หรือต่ำกว่า) แสดงเฉพาะไอคอน */}
          <div className="md:hidden flex gap-2">
            <Link to="/login">
              <Button size="icon">
                <LogIn className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* ✅ แสดงเมนูแบบเต็มบน md ขึ้นไป */}
          <div className="hidden md:flex">
            <DropdownListMenu />
          </div>

          {/* ✅ แสดงไอคอนแทนเมนูบนจอเล็ก */}
          <div className="md:hidden">
            <Link to="/user/profile">
              <ProfileButton/>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
export default DropdownAndUser