import { useForm, useFormState } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "../form/InputForm";
import { loginAPI } from "@/api/authAPI";
import { loginSchema } from "@/utils/schemas";
import { Navigate, useNavigate, Link } from "react-router";
import useAuthStore from "@/store/useAuthStore";
import GoogleButtonLogin from "./GoogleButtonLogin";
import { toast } from "sonner";
import { useState } from "react";
import { Lock, UserCircle, ArrowRight, ArrowLeft } from "lucide-react";

function Login({ embedded = false }) {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  //Zustand
  const hydrate = useAuthStore((state) => state.hydrate);

  //HookForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const dateTime = new Date().toLocaleString();

  const hdlLogin = async (data) => {
    try {
      const res = await loginAPI(data);

      hydrate();
      toast.message(<p className="text-emerald-500">{res.data.message}</p>, {
        description: dateTime,
      });

      // Redirect based on user role
      if (res.data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "BUSINESS") {
        navigate("/business/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  const handleNavigateToRegister = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/register");
    }, 300);
  };

  // If embedded, return only the form content
  if (embedded) {
    return (
      <form onSubmit={handleSubmit(hdlLogin)} className="space-y-6">
        <InputForm
          register={register}
          name="email"
          type="email"
          label="อีเมล"
          placeholder="กรุณาใส่อีเมลของคุณ"
          errors={errors}
        />

        <InputForm
          register={register}
          name="password"
          type="password"
          label="รหัสผ่าน"
          placeholder="กรุณาใส่รหัสผ่าน"
          errors={errors}
        />

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-red-600 hover:text-red-800 hover:underline transition-all duration-200"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              กำลังเข้าสู่ระบบ...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              เข้าสู่ระบบ
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">หรือ</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleButtonLogin />
        </div>
      </form>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-5xl relative">
        {/* Back to home */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="text-red-600 hover:text-red-800 transition-all duration-200 text-sm font-medium inline-flex items-center group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            กลับหน้าแรก
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg overflow-hidden">
          <div className="flex min-h-[600px]">
            {/* Left Side - Welcome Panel */}
            <div className="w-1/2 bg-gradient-to-br from-red-500 to-pink-600 p-12 flex flex-col justify-center relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern
                    id="login-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="10" cy="10" r="2" fill="white" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#login-grid)" />
                </svg>
              </div>

              <div className="relative z-10 text-white">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <Lock className="w-12 h-12 text-white" />
                  </div>

                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    ยินดีต้อนรับกลับมา!
                  </h1>

                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    เข้าสู่ระบบเพื่อค้นหาที่พักในฝันของคุณ
                    พร้อมประสบการณ์ที่ไม่เหมือนใคร
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span className="text-white/90">
                        ที่พักคุณภาพสูงกว่า 1,000+ แห่ง
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span className="text-white/90">
                        จองง่าย ปลอดภัย ยืนยันทันที
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span className="text-white/90">
                        รีวิวจริงจากผู้ใช้งาน
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <p className="text-white/80 text-sm mb-4">ยังไม่มีบัญชี?</p>
                  <button
                    onClick={handleNavigateToRegister}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border border-white/30 inline-flex items-center"
                  >
                    <UserCircle className="w-5 h-5 mr-2" />
                    สมัครสมาชิก
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-1/2 p-12 flex flex-col justify-center">
              <div
                className={`transition-opacity duration-300 ${
                  isAnimating ? "opacity-50" : "opacity-100"
                }`}
              >
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    เข้าสู่ระบบ
                  </h2>
                  <p className="text-gray-600 text-lg">
                    กรอกข้อมูลเพื่อเข้าสู่ระบบ
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(hdlLogin)} className="space-y-6">
                  <InputForm
                    register={register}
                    name="email"
                    type="email"
                    label="อีเมล"
                    placeholder="กรุณาใส่อีเมลของคุณ"
                    errors={errors}
                  />

                  <InputForm
                    register={register}
                    name="password"
                    type="password"
                    label="รหัสผ่าน"
                    placeholder="กรุณาใส่รหัสผ่าน"
                    errors={errors}
                  />

                  {/* Forgot password */}
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-red-600 hover:text-red-800 hover:underline transition-all duration-200"
                    >
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        กำลังเข้าสู่ระบบ...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        เข้าสู่ระบบ
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </div>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-6 bg-white text-gray-500 text-base">
                        หรือ
                      </span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <div className="flex justify-center">
                    <GoogleButtonLogin />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default Login;
