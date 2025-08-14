import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/utils/schemas";
import { updateProfileAPI } from "@/api/authAPI";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InputForm from "@/components/form/InputForm";
import { User, Lock, Eye, EyeOff, Settings } from "lucide-react";

function ProfileEdit({ user }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const hydrate = useAuthStore((state) => state.hydrate);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user?.username || "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
      isGoogleUser:
        user?.googleId && (!user?.password || user?.password === ""),
    },
  });

  const watchPassword = watch("password");

  const handleUpdateProfile = async (data) => {
    try {
      // ลบฟิลด์ที่ว่างออก
      const updateData = {};

      if (data.username && data.username !== user?.username) {
        updateData.username = data.username;
      }

      if (data.password) {
        updateData.password = data.password;
        // สำหรับ Google User ไม่ต้องส่ง currentPassword
        const isGoogleUser =
          user?.googleId && (!user?.password || user?.password === "");
        if (!isGoogleUser) {
          updateData.currentPassword = data.currentPassword;
        }
      }

      // ถ้าไม่มีข้อมูลที่จะอัปเดต
      if (Object.keys(updateData).length === 0) {
        toast.info("ไม่มีข้อมูลที่เปลี่ยนแปลง");
        return;
      }

      const res = await updateProfileAPI(updateData);

      // อัปเดต store
      hydrate();

      // รีเซ็ตฟอร์ม
      reset({
        username: res.data.user.username,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });

      setIsChangingPassword(false);

      toast.success("อัปเดตข้อมูลสำเร็จ!");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            แก้ไขข้อมูลส่วนตัว
          </h2>
          <p className="text-gray-600">อัปเดตชื่อผู้ใช้และรหัสผ่านของคุณ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
        {/* Username Section */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">ชื่อผู้ใช้</h3>
          </div>

          <InputForm
            register={register}
            name="username"
            type="text"
            label="ชื่อผู้ใช้"
            placeholder="กรุณาใส่ชื่อผู้ใช้ใหม่"
            errors={errors}
          />
        </Card>

        {/* Password Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">รหัสผ่าน</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? "ยกเลิก" : "เปลี่ยนรหัสผ่าน"}
            </Button>
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              {/* Current Password - แสดงข้อความต่างกันสำหรับ Google User */}
              {!user?.googleId || user?.password ? (
                <div className="relative">
                  <InputForm
                    register={register}
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    label="รหัสผ่านปัจจุบัน"
                    placeholder="กรุณาใส่รหัสผ่านปัจจุบัน"
                    errors={errors}
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm font-medium text-red-900">
                      บัญชี Google - ตั้งรหัสผ่านสำหรับ Login ปกติ
                    </p>
                  </div>
                  <p className="text-sm text-red-800">
                    คุณสามารถตั้งรหัสผ่านเพื่อใช้ Login แบบปกติได้
                    โดยไม่ต้องใส่รหัสผ่านเดิม
                  </p>
                </div>
              )}

              {/* New Password */}
              <div className="relative">
                <InputForm
                  register={register}
                  name="password"
                  type={showNewPassword ? "text" : "password"}
                  label="รหัสผ่านใหม่"
                  placeholder="กรุณาใส่รหัสผ่านใหม่"
                  errors={errors}
                />
              </div>

              {/* Confirm Password */}
              {watchPassword && (
                <div className="relative">
                  <InputForm
                    register={register}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    label="ยืนยันรหัสผ่านใหม่"
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    errors={errors}
                  />
                  
                </div>
              )}

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  รหัสผ่านต้องมี:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• อย่างน้อย 8 ตัวอักษร</li>
                  <li>• ตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว</li>
                  <li>• ตัวพิมพ์เล็กอย่างน้อย 1 ตัว</li>
                  <li>• ตัวเลขอย่างน้อย 1 ตัว</li>
                </ul>
              </div>
            </div>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                กำลังอัปเดต...
              </div>
            ) : (
              "อัปเดตข้อมูล"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
  className = "object-cover ]";
  alt = "@shadcn";
}

export default ProfileEdit;
