import { publicLinks } from "@/utils/links";
import Login from "../authentication/Login";
import Register from "../authentication/register";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react";
import MenuList from "./MenuList";
import useAuthStore from "@/store/useAuthStore";
import DropdownAndUser from "./DropdownAndUser";
import { Search, Globe, Menu, User } from "lucide-react";
import { Link } from "react-router";

function Navbar() {
  const user = useAuthStore((state) => state.user);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Logo />
            </div>

            {/* Center - Navigation Menu */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <nav className="flex items-center space-x-8">
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  หน้าหลัก
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  เกี่ยวกับเรา
                </Link>
                <Link
                  to="/service"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  บริการ
                </Link>
                <Link
                  to="/contact"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  ติดต่อเรา
                </Link>
                {user && (
                  <>
                    <Link
                      to="/user/myfavorite"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      รายการโปรด
                    </Link>
                    <Link
                      to="/user/profile"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      โปรไฟล์
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Right Section - User Menu */}
            <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              {/* Become a host link - Desktop only */}
              <div className="hidden xl:block">
                <button className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap">
                  เป็นเจ้าของที่พัก
                </button>
              </div>

              {/* Language/Globe icon - Desktop only */}
              <div className="hidden lg:block">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <Globe className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {!user ? (
                  <div className="flex items-center border border-gray-300 rounded-full p-1 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center">
                      <button className="p-1 md:p-2">
                        <Menu className="w-4 h-4 text-gray-700" />
                      </button>

                      {/* User Menu Button */}
                      <button
                        className="w-7 h-7 md:w-8 md:h-8 bg-gray-500 rounded-full flex items-center justify-center focus:outline-none ml-1 md:ml-2"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      >
                        <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </button>

                      {/* Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <div className="py-2">
                            <Link
                              to="/auth"
                              className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              สมัครสมาชิก / เข้าสู่ระบบ
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              เป็นเจ้าของที่พัก
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              ช่วยเหลือ
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <DropdownAndUser />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
