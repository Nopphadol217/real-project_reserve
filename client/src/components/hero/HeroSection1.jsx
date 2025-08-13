import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { MoveRight, MapPin, Calendar, Users, Star } from "lucide-react";
import { useNavigate } from "react-router";

function HeroSection1() {
  // zustand
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);
  const navigate = useNavigate();

  useEffect(() => {
    myProfile();
  }, []);

  const myProfile = async () => {
    try {
      hydrate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative  w-full bg-[url('/background/hero_section.png')] bg-cover bg-center bg-no-repeat">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-red-900/20"></div>

      {/* Content */}
      <div className="relative container z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="text-center xl:text-left mx-auto space-y-8">
          {/* Welcome Badge */}
          {user?.username && (
            <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border border-white/20 text-gray-800 text-sm font-medium mb-6 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              สวัสดี, {user.username}
            </div>
          )}

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              ระบบจองที่พัก
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              ค้นหาและจองที่พักได้ง่าย
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl xl:max-w-4xl mx-auto xl:mx-0 leading-relaxed font-light">
            เว็บจองที่พักออนไลน์ที่ใช้งานง่าย สะดวก และปลอดภัย
            <br />
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center xl:justify-start items-center">
            <button
              onClick={() => navigate("/search-places")}
              className="group bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 flex items-center min-w-[200px] justify-center"
            >
              <MapPin className="mr-3 w-6 h-6" />
              เริ่มค้นหาที่พัก
              <MoveRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="group border-2 border-white/50 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 min-w-[200px]"
            >
              เรียนรู้เพิ่มเติม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeroSection1;
