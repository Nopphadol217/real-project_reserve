import { Helmet } from "react-helmet-async";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { MoveRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

function HeroSection1() {
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
    <>
      {/* SEO Meta */}
      <Helmet>
        <title>Bookylife | Project นักศึกษา เว็บจองที่พักทดลอง</title>
        <meta
          name="description"
          content="Bookylife เป็นโปรเจคเว็บจองที่พักสำหรับนักศึกษา ใช้เพื่อการทดลองและศึกษา ไม่มีการให้บริการจริง"
        />
        <meta name="keywords" content="project นักศึกษา, เว็บจองที่พัก, ทดลอง, Bookylife" />
        <meta name="author" content="นักศึกษาผู้พัฒนา Bookylife" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Bookylife | Project นักศึกษา เว็บจองที่พักทดลอง" />
        <meta
          property="og:description"
          content="Bookylife เป็นโปรเจคเว็บจองที่พักสำหรับนักศึกษา ใช้เพื่อการทดลองและศึกษา ไม่มีการให้บริการจริง"
        />
        <meta property="og:image" content="/logo/bookylife_og.png" />
        <meta property="og:url" content="https://demo-hotel.nkstec.ac.th" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bookylife | Project นักศึกษา เว็บจองที่พักทดลอง" />
        <meta
          name="twitter:description"
          content="Bookylife เป็นโปรเจคเว็บจองที่พักสำหรับนักศึกษา ใช้เพื่อการทดลองและศึกษา ไม่มีการให้บริการจริง"
        />
        <meta name="twitter:image" content="/logo/bookylife_og.png" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full bg-[url('/background/hero_section.webp')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-red-900/20"></div>
        <div className="relative container z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <div className="text-center xl:text-left mx-auto space-y-8">
            {user?.username && (
              <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full border border-white/20 text-gray-800 text-sm font-medium mb-6 shadow-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                สวัสดี, {user.username}
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight">
                ระบบจองที่พัก
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                ค้นหาและจองที่พักได้ง่าย
              </p>
            </div>

            <p className="text-xl sm:text-xl text-white/90 max-w-3xl xl:max-w-4xl mx-auto xl:mx-0 leading-relaxed font-light">
              เว็บจองที่พักออนไลน์
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center xl:justify-start items-center">
              <button
                onClick={() => navigate("/search-places")}
                className="group bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white px-8 py-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 flex items-center min-w-[200px] justify-center"
              >
                <MapPin className="mr-3 w-6 h-6" />
                เริ่มค้นหาที่พัก
                <MoveRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection1;
