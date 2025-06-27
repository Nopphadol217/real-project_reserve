import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import Navbar from "../navbar/Navbar";

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
    // ปรับ responsive height ให้เหมาะสมกับทุกขนาดหน้าจอ
    <div className="relative w-full h-[35vh] sm:h-[45vh] md:h-[50vh] lg:h-[45vh] xl:h-[50vh]">
      {/* Background section */}
      <section className="absolute inset-0 w-full bg-gradient-to-br from-sky-300 to-sky-400 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      </section>

      {/* Content overlay */}
      <div className="relative container  z-10 w-full h-full flex flex-col">
        {/* Navbar container */}
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <Navbar />
          </div>
        </div>

        {/* Hero content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center md:text-left space-y-2 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-3xl  text-white drop-shadow-lg">
                ยินดีต้อนรับสู่ เว็บจองที่พัก
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-md">
                คุณ {user?.username || "ผู้ใช้งาน"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeroSection1;
