import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  QrCode,
  Upload,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { FileUpload } from "@/components/ui/file-upload";
import { resizeFile } from "@/utils/resizeFile";
import { uploadImageAPI, deleteImageAPI } from "@/api/UploadImageAPI";
import {
  getPaymentInfoAPI,
  updatePaymentInfoAPI,
  createBusinessPaymentInfoAPI,
} from "@/api/paymentAPI";
import { useParams, useNavigate } from "react-router";
import useAuthStore from "@/store/useAuthStore";

const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [isQrLoading, setIsQrLoading] = useState(false);

  const { placeId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountName: "",
    },
  });

  const bankOptions = [
    { value: "กสิกรไทย", label: "ธนาคารกสิกรไทย" },
    { value: "กรุงเทพ", label: "ธนาคารกรุงเทพ" },
    { value: "กรุงไทย", label: "ธนาคารกรุงไทย" },
    { value: "ไทยพาณิชย์", label: "ธนาคารไทยพาณิชย์" },
    { value: "กรุงศรีอยุธยา", label: "ธนาคารกรุงศรีอยุธยา" },
    { value: "ทหารไทยธนชาต", label: "ธนาคารทหารไทยธนชาต" },
    { value: "เกียรตินาคินภัทร", label: "ธนาคารเกียรตินาคินภัทร" },
    { value: "ซีไอเอ็มบี ไทย", label: "ธนาคารซีไอเอ็มบี ไทย" },
    { value: "ทิสโก้", label: "ธนาคารทิสโก้" },
    { value: "ยูโอบี", label: "ธนาคารยูโอบี" },
    { value: "แลนด์ แอนด์ เฮ้าส์", label: "ธนาคารแลนด์ แอนด์ เฮ้าส์" },
    { value: "ไอซีบีซี (ไทย)", label: "ธนาคารไอซีบีซี (ไทย)" },
  ];

  const bankName = watch("bankName");

  useEffect(() => {
    if (placeId) {
      fetchPaymentInfo();
    }
  }, [placeId]);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await getPaymentInfoAPI(placeId);
      console.log("Payment Info Response:", response);

      if (response.data.success && response.data.data) {
        const info = response.data.data;
        console.log("Payment Info Data:", info);
        setPaymentInfo(info);

        // Reset form with fetched data
        const formData = {
          bankName: info.bankName || "",
          accountNumber: info.accountNumber || "",
          accountName: info.accountName || "",
        };
        console.log("Form Reset Data:", formData);
        reset(formData);

        if (info.qrCodeUrl) {
          console.log("Setting QR Preview:", info.qrCodeUrl);
          setQrPreview(info.qrCodeUrl);
        }
      } else {
        console.log("No payment info found or unsuccessful response");
      }
    } catch (error) {
      console.error("Error fetching payment info:", error);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน");
    } finally {
      setLoading(false);
    }
  };

  const handleQRCodeUpload = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    try {
      setIsQrLoading(true);

      const resizedFile = await resizeFile(file);
      const uploadFormData = new FormData();
      uploadFormData.append("image", resizedFile);

      const response = await uploadImageAPI(uploadFormData);
      if (response.data && response.data.secure_url) {
        setQrPreview(response.data.secure_url);
        toast.success("อัปโหลด QR Code สำเร็จ");
      }
    } catch (error) {
      console.error("Error uploading QR code:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด QR Code");
    } finally {
      setIsQrLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.bankName || !data.accountNumber || !data.accountName) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        qrCodeUrl: qrPreview || "",
        placeId: parseInt(placeId),
      };

      let response;
      if (paymentInfo?.id) {
        response = await updatePaymentInfoAPI(placeId, submitData);
      } else {
        response = await createBusinessPaymentInfoAPI(submitData);
      }

      console.log("Submit Response:", response);

      if (response.data.success) {
        // อัพเดทข้อมูลจาก response
        const updatedInfo = response.data.data || response.data.paymentInfo;
        setPaymentInfo(updatedInfo);
        toast.success("บันทึกข้อมูลการชำระเงินสำเร็จ");

        // รีเฟรชข้อมูล
        fetchPaymentInfo();
      }
    } catch (error) {
      console.error("Error saving payment info:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ตั้งค่าข้อมูลการชำระเงิน
          </h1>
          <p className="text-gray-600">
            จัดการข้อมูลธนาคารและ QR Code สำหรับรับเงิน
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-500" />
            ข้อมูลการชำระเงิน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Bank Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bank Selection */}
              <div className="space-y-2">
                <Label htmlFor="bankName">ธนาคาร</Label>
                <Select
                  defaultValue={`${paymentInfo?.bankName || ""}`}
                  onValueChange={(value) => setValue("bankName", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกธนาคาร" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bankName && (
                  <p className="text-sm text-red-500">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">เลขที่บัญชี</Label>
                <Input
                  {...register("accountNumber", {
                    required: "กรุณากรอกเลขที่บัญชี",
                  })}
                  placeholder="xxx-x-xxxxx-x"
                  className={errors.accountNumber ? "border-red-500" : ""}
                />
                {errors.accountNumber && (
                  <p className="text-sm text-red-500">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName">ชื่อบัญชี</Label>
              <Input
                {...register("accountName", {
                  required: "กรุณากรอกชื่อบัญชี",
                })}
                placeholder="ชื่อบัญชีผู้รับเงิน"
                className={errors.accountName ? "border-red-500" : ""}
              />
              {errors.accountName && (
                <p className="text-sm text-red-500">
                  {errors.accountName.message}
                </p>
              )}
            </div>

            {/* QR Code Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                <Label>QR Code สำหรับการชำระเงิน</Label>
              </div>

              {qrPreview && (
                <div className="relative">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer group">
                        <img
                          src={qrPreview}
                          alt="QR Code"
                          className="w-32 h-32 object-cover rounded-lg border group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>QR Code สำหรับการชำระเงิน</DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <img
                          src={qrPreview}
                          alt="QR Code"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 bg-green-100 text-green-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    มี QR Code
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                    onClick={() => {
                      setQrPreview(null);
                      toast.success("ลบ QR Code แล้ว");
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}

              <FileUpload
                onChange={handleQRCodeUpload}
                disabled={isQrLoading}
              />

              {isQrLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">กำลังอัปโหลด QR Code...</span>
                </div>
              )}

              {!qrPreview && !isQrLoading && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">แนะนำให้อัปโหลด QR Code</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={saving || isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                {saving || isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    บันทึกข้อมูลการชำระเงิน
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;
