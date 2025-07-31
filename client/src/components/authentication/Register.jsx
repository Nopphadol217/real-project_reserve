import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "../form/InputForm";
import { registerSchema } from "@/utils/schemas";
import { registerAPI } from "@/api/authAPI";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { UserPlus, ArrowRight, ArrowLeft, Lock } from "lucide-react";

function Register({ embedded = false }) {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const hdlSubmit = async (data) => {
    try {
      const res = await registerAPI(data);
      toast.success("สมัครสมาชิกสำเร็จ! กำลังไปหน้าเข้าสู่ระบบ");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      console.log(res);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "มี email นี้ในระบบแล้ว"
      ) {
        setError("email", {
          type: "server",
          message: "มี email นี้ในระบบแล้ว",
        });
        toast.error("มี email นี้ในระบบแล้ว");
      } else {
        setError("root", {
          type: "server",
          message: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่",
        });
        toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    }
  };

  const handleNavigateToLogin = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  // If embedded, return only the form content
  if (embedded) {
    return (
      <form onSubmit={handleSubmit(hdlSubmit)} className="space-y-6">
        <InputForm
          register={register}
          name="username"
          type="text"
          label="ชื่อผู้ใช้"
          placeholder="กรุณาใส่ชื่อผู้ใช้"
          errors={errors}
        />

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

        <InputForm
          register={register}
          name="confirmPassword"
          type="password"
          label="ยืนยันรหัสผ่าน"
          placeholder="กรุณาใส่รหัสผ่านอีกครั้ง"
          errors={errors}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              กำลังสมัครสมาชิก...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              สมัครสมาชิก
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </Button>
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
                    id="register-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="10" cy="10" r="2" fill="white" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#register-grid)" />
                </svg>
              </div>

              <div className="relative z-10 text-white">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-300">
                    <UserPlus className="w-12 h-12 text-white" />
                  </div>

                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    เริ่มต้นการเดินทาง
                  </h1>

                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    สร้างบัญชีใหม่และเข้าร่วมชุมชนนักท่องเที่ยวที่ใหญ่ที่สุด
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span className="text-white/90">
                        สมัครฟรี ไม่มีค่าใช้จ่าย
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span className="text-white/90">เข้าถึงที่พักพิเศษ</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span className="text-white/90">
                        สะสมคะแนนและรับส่วนลด
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <p className="text-white/80 text-sm mb-4">มีบัญชีอยู่แล้ว?</p>
                  <button
                    onClick={handleNavigateToLogin}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border border-white/30 inline-flex items-center"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    เข้าสู่ระบบ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-1/2 p-12 flex flex-col justify-center">
              <div
                className={`transition-opacity duration-300 ${
                  isAnimating ? "opacity-50" : "opacity-100"
                }`}
              >
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    สมัครสมาชิก
                  </h2>
                  <p className="text-gray-600 text-lg">
                    สร้างบัญชีใหม่เพื่อเริ่มต้น
                  </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit(hdlSubmit)} className="space-y-6">
                  <InputForm
                    register={register}
                    name="username"
                    type="text"
                    label="ชื่อผู้ใช้"
                    placeholder="กรุณาใส่ชื่อผู้ใช้"
                    errors={errors}
                  />

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

                  <InputForm
                    register={register}
                    name="confirmPassword"
                    type="password"
                    label="ยืนยันรหัสผ่าน"
                    placeholder="กรุณาใส่รหัสผ่านอีกครั้ง"
                    errors={errors}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg text-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        กำลังสมัครสมาชิก...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        สมัครสมาชิก
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default Register;
