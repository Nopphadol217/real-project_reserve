import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { MoveRight } from "lucide-react";

function HeroSection1() {
  // zustand
  const user = useAuthStore((state) => state.user);
  const hydrate = useAuthStore((state) => state.hydrate);

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
    <div className=" w-full min-h-[70vh] bg-[url('/background/hero_section.png')] bg-cover bg-center bg-no-repeat">
      {/* Background decorations */}

      {/* Content */}
      <div className="relative container z-10  min-h-[70vh] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center xl:text-left  mx-auto space-y-6">
          {/* Welcome Badge */}
          {user?.username && (
            <div className="inline-flex items-center px-4 py-2 bg-red-500/95 rounded-lg border border-red-200 text-white text-sm font-medium mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              สวัสดี, {user.username}
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl  font-semibold text-white leading-tight mb-4">
            ระบบจองที่พัก
            <span className="block text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mt-2">
              ค้นหาและจองที่พักได้ง่าย
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white max-w-2xl xl:max-w-3xl mx-auto xl:mx-0 leading-relaxed mb-8">
            แพลตฟอร์มจองที่พักออนไลน์ที่ใช้งานง่าย สะดวก และปลอดภัย
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start items-center mb-12">
            <button className="group  bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
              เริ่มค้นหาที่พัก
              <MoveRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button className="group border-2 border-red-300 hover:border-red-400 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              ดูรายละเอียดเพิ่มเติม
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeroSection1;
