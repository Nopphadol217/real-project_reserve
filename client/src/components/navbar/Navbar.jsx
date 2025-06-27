import { publicLinks } from "@/utils/links";
import Login from "../authentication/Login";
import Register from "../authentication/register";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { Button } from "../ui/button";
import { useState } from "react";
import MenuList from "./MenuList";
import useAuthStore from "@/store/useAuthStore";
import DropdownAndUser from "./DropdownAndUser";
import { DayPickerProvider } from "react-day-picker";
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 mt-4">
      <div className="mx-auto max-w-7xl container">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-lg bg-blue-800/40 backdrop-blur-md">
          {/* 🎨 Gradient overlay เพิ่มความลึก */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/30 via-[#9333ea]/10 to-[#06b6d4]/10 pointer-events-none" />

          {/* 🧭 Navbar content */}
          <div className="relative px-6 py-3 flex items-center justify-between">
            {/* 🅰️ Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* 🖥 Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center space-x-8">
              <MenuList />
            </div>

            {/* 📱 Mobile Menu Toggle */}
            <div className="lg:hidden mx-auto">
              <MenuList isMobileOnlyToggle />
            </div>

            {/* 👤 Auth/Dropdown */}
            <div>
              <DropdownAndUser />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
