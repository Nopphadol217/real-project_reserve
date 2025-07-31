import useAuthStore from "@/store/useAuthStore";
import DropdownListMenu from "./DropdownListMenu";
import { AlignLeft, LogIn, UserIcon, Menu, User } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import ProfileButton from "@/pages/user/profile/ProfileButton";

function DropdownAndUser() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex items-center border border-gray-300 rounded-full p-1 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-2">
          <button className="p-2">
            <Menu className="w-4 h-4 text-gray-700" />
          </button>
          <Link
            to="/auth"
            className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <User className="w-5 h-5 text-white" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-full p-1 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-2">
        <button className="p-2">
          <Menu className="w-4 h-4 text-gray-700" />
        </button>

        {/* User Avatar */}
        <div className="relative">
          <DropdownListMenu />
        </div>
      </div>
    </div>
  );
}
export default DropdownAndUser;
