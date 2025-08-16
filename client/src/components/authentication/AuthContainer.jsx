import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@/utils/schemas";
import { loginAPI, registerAPI } from "@/api/authAPI";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import InputForm from "../form/InputForm";
import GoogleButtonLogin from "./GoogleButtonLogin";
import { UserCircle, Lock, ArrowLeft, ArrowRight } from "lucide-react";

function AuthContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const hydrate = useAuthStore((state) => state.hydrate);

  // Form for login
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Form for register
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    setIsLogin(location.pathname === "/login" || location.pathname === "/auth");
  }, [location.pathname]);

  const handleSwitch = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      // Reset forms when switching
      loginForm.reset();
      registerForm.reset();

      if (location.pathname === "/auth") {
        // Don't change URL for auth container
        setIsAnimating(false);
      } else {
        navigate(isLogin ? "/register" : "/login", { replace: true });
        setIsAnimating(false);
      }
    }, 300);
  };

  const handleLogin = async (data) => {
    try {
      const res = await loginAPI(data);
      hydrate();
      toast.success("เข้าสู่ระบบสำเร็จ!");

      if (res.data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  const handleRegister = async (data) => {
    try {
      const res = await registerAPI(data);
      toast.success("สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ");

      setTimeout(() => {
        setIsLogin(true);
        registerForm.reset();
      }, 1500);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "มี email นี้ในระบบแล้ว"
      ) {
        registerForm.setError("email", {
          type: "server",
          message: "มี email นี้ในระบบแล้ว",
        });
        toast.error("มี email นี้ในระบบแล้ว");
      } else {
        registerForm.setError("root", {
          type: "server",
          message: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่",
        });
        toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-100 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-72 sm:h-72 bg-red-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 sm:w-96 sm:h-96 bg-pink-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 bg-orange-200/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl relative">
        {/* Back to home */}
        <div className="text-center mb-4 sm:mb-6">
          <button
            onClick={handleBackToHome}
            className="text-red-600 hover:text-red-800 transition-all duration-200 text-xs sm:text-sm font-medium inline-flex items-center group"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            กลับหน้าแรก
          </button>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            {/* Left Side - Information Panel with Background Image */}
            <div className="w-full lg:w-1/2 relative overflow-hidden">
              {/* Background Image */}
              <div
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
                  isLogin
                    ? "bg-[url('/public/background/login_background.png')]"
                    : "bg-[url('/public/background/register_background.png')]"
                }`}
              ></div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-pink-600/40"></div>

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 lg:p-12 flex flex-col justify-center h-full text-white min-h-[200px] lg:min-h-full">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <pattern
                      id="auth-grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="10" cy="10" r="2" fill="white" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#auth-grid)" />
                  </svg>
                </div>

                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 transform hover:rotate-12 transition-transform duration-300 mx-auto lg:mx-0">
                    {isLogin ? (
                      <Lock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                    ) : (
                      <UserCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight text-center lg:text-left">
                    {isLogin ? "ยินดีต้อนรับกลับมา!" : "เริ่มต้นการเดินทาง"}
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-center lg:text-left">
                    {isLogin
                      ? "เข้าสู่ระบบเพื่อค้นหาที่พักในฝันของคุณ พร้อมประสบการณ์ที่ไม่เหมือนใคร"
                      : "สร้างบัญชีใหม่และเข้าร่วมชุมชนนักท่องเที่ยวที่ใหญ่ที่สุด"}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 lg:mt-12 text-center lg:text-left">
                  <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-4">
                    {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีอยู่แล้ว?"}
                  </p>
                  <button
                    onClick={handleSwitch}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border border-white/30 text-sm sm:text-base"
                  >
                    {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Form Panel */}
            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-12 flex flex-col justify-center">
              <div
                className={`transition-opacity duration-300 ${
                  isAnimating ? "opacity-50" : "opacity-100"
                }`}
              >
                {/* Tab Header */}
                <div className="flex mb-4 sm:mb-6 lg:mb-8 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => !isLogin && handleSwitch()}
                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 font-medium transition-all duration-300 rounded-md ${
                      isLogin
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm lg:text-base">
                        เข้าสู่ระบบ
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => isLogin && handleSwitch()}
                    className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 font-medium transition-all duration-300 rounded-md ${
                      !isLogin
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm lg:text-base">
                        สมัครสมาชิก
                      </span>
                    </div>
                  </button>
                </div>

                {/* Form Content */}
                <div className="relative overflow-hidden">
                  <div
                    className={`transition-transform duration-500 ease-in-out ${
                      isLogin ? "translate-x-0" : "-translate-x-1/2"
                    }`}
                    style={{ width: "200%" }}
                  >
                    {/* Login Form */}
                    <div className="w-1/2 pr-2 sm:pr-4 inline-block">
                      <div className="mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                          เข้าสู่ระบบ
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                          กรอกข้อมูลเพื่อเข้าสู่ระบบ
                        </p>
                      </div>

                      <form
                        onSubmit={loginForm.handleSubmit(handleLogin)}
                        className="space-y-4 sm:space-y-6"
                      >
                        <InputForm
                          register={loginForm.register}
                          name="email"
                          type="email"
                          label="อีเมล"
                          placeholder="กรุณาใส่อีเมลของคุณ"
                          errors={loginForm.formState.errors}
                        />

                        <InputForm
                          register={loginForm.register}
                          name="password"
                          type="password"
                          label="รหัสผ่าน"
                          placeholder="กรุณาใส่รหัสผ่าน"
                          errors={loginForm.formState.errors}
                        />

                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-red-600 hover:text-red-800 hover:underline transition-all duration-200"
                          >
                            ลืมรหัสผ่าน?
                          </button>
                        </div>

                        <Button
                          type="submit"
                          disabled={loginForm.formState.isSubmitting}
                          className="w-full h-10 sm:h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg text-sm sm:text-base"
                        >
                          {loginForm.formState.isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                              <span className="text-xs sm:text-sm">
                                กำลังเข้าสู่ระบบ...
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span className="text-sm sm:text-base">
                                เข้าสู่ระบบ
                              </span>
                              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                            </div>
                          )}
                        </Button>

                        <div className="relative my-4 sm:my-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-xs sm:text-sm">
                            <span className="px-2 sm:px-4 bg-white text-gray-500">
                              หรือ
                            </span>
                          </div>
                        </div>
                      </form>
                      <div className="flex justify-center mt-4">
                        <GoogleButtonLogin />
                      </div>
                    </div>

                    {/* Register Form */}
                    <div className="w-1/2 pl-2 sm:pl-4 inline-block">
                      <div className="mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                          สมัครสมาชิก
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                          สร้างบัญชีใหม่เพื่อเริ่มต้น
                        </p>
                      </div>

                      <form
                        onSubmit={registerForm.handleSubmit(handleRegister)}
                        className="space-y-4 sm:space-y-6"
                      >
                        <InputForm
                          register={registerForm.register}
                          name="username"
                          type="text"
                          label="ชื่อผู้ใช้"
                          placeholder="กรุณาใส่ชื่อผู้ใช้"
                          errors={registerForm.formState.errors}
                        />

                        <InputForm
                          register={registerForm.register}
                          name="email"
                          type="email"
                          label="อีเมล"
                          placeholder="กรุณาใส่อีเมลของคุณ"
                          errors={registerForm.formState.errors}
                        />

                        <InputForm
                          register={registerForm.register}
                          name="password"
                          type="password"
                          label="รหัสผ่าน"
                          placeholder="กรุณาใส่รหัสผ่าน"
                          errors={registerForm.formState.errors}
                        />

                        <InputForm
                          register={registerForm.register}
                          name="confirmPassword"
                          type="password"
                          label="ยืนยันรหัสผ่าน"
                          placeholder="กรุณาใส่รหัสผ่านอีกครั้ง"
                          errors={registerForm.formState.errors}
                        />

                        <Button
                          type="submit"
                          disabled={registerForm.formState.isSubmitting}
                          className="w-full h-10 sm:h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg text-sm sm:text-base"
                        >
                          {registerForm.formState.isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                              <span className="text-xs sm:text-sm">
                                กำลังสมัครสมาชิก...
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span className="text-sm sm:text-base">
                                สมัครสมาชิก
                              </span>
                              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                            </div>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AuthContainer;
