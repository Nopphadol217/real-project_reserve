import React from "react";
import { Heart } from "lucide-react";
import { Separator } from "./separator";

const Footer = ({ variant = "default" }) => {
  const isMinimal = variant === "minimal";

  if (isMinimal) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-600">
              <span>© 2025 BookyLife - สร้างโดย</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">Nopphadol Saipakdee</span>
                <Heart className="w-3 h-3 text-red-400 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-r from-red-500 to-red-600 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo/Brand Section */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              BookyLife
            </h3>
            <p className="text-blue-100 text-sm mt-1">ระบบจองที่พักออนไลน์</p>
          </div>

          <Separator className="my-4" />

          {/* Copyright Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
            <span className="text-blue-100">© 2025 BookyLife. สร้างโดย</span>
            <div className="flex items-center gap-1">
              <span className="font-medium text-white">
                Nopphadol Saipakdee
              </span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-3 text-xs text-blue-200">
            พัฒนาด้วย React.js • Node.js • Prisma • MySQL
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
