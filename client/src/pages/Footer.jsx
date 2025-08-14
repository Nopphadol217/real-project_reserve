import React from "react";
import { Heart } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Link } from "react-router";
import { footerLinks } from "@/utils/links";

const Footer = ({ variant = "default" }) => {
  const isMinimal = variant === "minimal";

  if (isMinimal) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
            <span>© 2025 BookyLife - สร้างโดย</span>
            <div className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <span className="font-medium">Nopphadol Saipakdee</span>
              <Heart className="w-3 h-3 text-red-400 fill-current" />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-r from-red-500 to-red-600 text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to={"/"}>
              <img
                src="/logo/bookylife.png"
                alt="BookyLife Logo"
                className="w-[150px] mb-2"
              />
            </Link>
            <p className="text-blue-100 text-sm">ระบบจองที่พักออนไลน์</p>
          </div>

          {/* Menu */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white xl:text-2xl">เมนู</h4>
            <ul className="space-y-1 text-blue-100 text-sm md:text-md xl:text-xl">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col space-y-2 ">
            <h2 className="text-xl">พัฒนาโดย Nopphadol Saipakdee</h2>
            <ul>
              <li>ใช้ ReactJS , Nodejs , ExpessJs </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-blue-200/30" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
          <span className="text-blue-100">© 2025 BookyLife. สร้างโดย</span>
          <div className="flex items-center gap-1 hover:text-red-300 transition-colors">
            <span className="font-medium text-white">Nopphadol Saipakdee</span>
            <p>จาก Nakhonsawan Technical College </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
