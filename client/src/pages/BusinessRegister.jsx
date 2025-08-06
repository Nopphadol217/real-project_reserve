import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

const BusinessRegister = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Business Information
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessPhone: "",
    businessDescription: "",

    // Agreement
    agreeTerms: false,
    agreePrivacy: false,
  });

  const businessTypes = [
    { value: "hotel", label: "โรงแรม" },
    { value: "resort", label: "รีสอร์ท" },
    { value: "apartment", label: "อพาร์ทเมนต์" },
    { value: "house", label: "บ้านพัก" },
    { value: "villa", label: "วิลลา" },
    { value: "hostel", label: "โฮสเทล" },
    { value: "condo", label: "คอนโด" },
    { value: "studio", label: "สตูดิโอ" },
    { value: "other", label: "อื่นๆ" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return false;
    }

    if (
      !formData.businessName ||
      !formData.businessType ||
      !formData.businessAddress
    ) {
      toast.error("กรุณากรอกข้อมูลธุรกิจให้ครบถ้วน");
      return false;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast.error("กรุณายอมรับเงื่อนไขและนโยบายความเป็นส่วนตัว");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // เตรียมข้อมูลส่ง
      const submitData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "BUSINESS", // กำหนดเป็น BUSINESS แต่จะเป็น pending
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        businessPhone: formData.businessPhone,
        businessDescription: formData.businessDescription,
        status: "pending", // รอการอนุมัติ
      };

      // จำลอง API call (ต้องสร้าง API จริงในภายหลัง)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("สมัครสมาชิกผู้ประกอบการสำเร็จ!");
      toast.success(
        "กรุณารอการตรวจสอบจากทีมงาน จะแจ้งผลทางอีเมลภายใน 2-3 วันทำการ"
      );

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            สมัครสมาชิกผู้ประกอบการ
          </h1>
          <p className="text-gray-600 mt-2">
            เข้าร่วมแพลตฟอร์มของเราและเริ่มต้นธุรกิจที่พักออนไลน์
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              ข้อมูลการสมัคร
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  ข้อมูลส่วนตัว
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstname">ชื่อจริง *</Label>
                    <Input
                      id="firstname"
                      value={formData.firstname}
                      onChange={(e) =>
                        handleInputChange("firstname", e.target.value)
                      }
                      placeholder="ชื่อจริง"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastname">นามสกุล *</Label>
                    <Input
                      id="lastname"
                      value={formData.lastname}
                      onChange={(e) =>
                        handleInputChange("lastname", e.target.value)
                      }
                      placeholder="นามสกุล"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="08X-XXX-XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">รหัสผ่าน *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="ยืนยันรหัสผ่าน"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {formData.password &&
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          รหัสผ่านไม่ตรงกัน
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  ข้อมูลธุรกิจ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">ชื่อธุรกิจ *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                      }
                      placeholder="ชื่อธุรกิจ/ร้านค้า"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">ประเภทธุรกิจ *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) =>
                        handleInputChange("businessType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทธุรกิจ" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessAddress">ที่อยู่ธุรกิจ *</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={(e) =>
                      handleInputChange("businessAddress", e.target.value)
                    }
                    placeholder="ที่อยู่ธุรกิจแบบละเอียด"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessPhone">เบอร์โทรธุรกิจ</Label>
                    <Input
                      id="businessPhone"
                      value={formData.businessPhone}
                      onChange={(e) =>
                        handleInputChange("businessPhone", e.target.value)
                      }
                      placeholder="02-XXX-XXXX"
                    />
                  </div>
                  <div></div>
                </div>

                <div>
                  <Label htmlFor="businessDescription">รายละเอียดธุรกิจ</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) =>
                      handleInputChange("businessDescription", e.target.value)
                    }
                    placeholder="อธิบายธุรกิจของคุณ เช่น บริการที่ให้, จุดเด่น, ประสบการณ์"
                    rows={3}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreeTerms", checked)
                    }
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="agreeTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      ยอมรับ{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        ข้อตกลงและเงื่อนไข
                      </Link>{" "}
                      *
                    </Label>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) =>
                      handleInputChange("agreePrivacy", checked)
                    }
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="agreePrivacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      ยอมรับ{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        นโยบายความเป็นส่วนตัว
                      </Link>{" "}
                      *
                    </Label>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">ขั้นตอนต่อไป</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      หลังจากส่งใบสมัครแล้ว ทีมงานจะตรวจสอบข้อมูลของคุณ
                      จะแจ้งผลการอนุมัติภายใน 2-3 วันทำการผ่านอีเมลที่ลงทะเบียน
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    กำลังส่งใบสมัคร...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    ส่งใบสมัคร
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegister;
