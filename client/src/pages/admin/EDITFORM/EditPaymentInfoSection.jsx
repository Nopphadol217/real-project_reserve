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
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { FileUpload } from "@/components/ui/file-upload";
import EditInputForm from "./EditInputForm";
import { resizeFile } from "@/utils/resizeFile";
import { uploadImageAPI, deleteImageAPI } from "@/api/UploadImageAPI";
import { getPaymentInfoAPI, updatePaymentInfoAPI } from "@/api/paymentAPI";

const EditPaymentInfoSection = ({ placeId, userId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [isQrLoading, setIsQrLoading] = useState(false);

  const {
    register,
    handleSubmit: onSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

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

  // Watch bankName to sync with Select component
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
      if (response.data.success && response.data.paymentInfo) {
        const info = response.data.paymentInfo;
        setPaymentInfo(info);

        // Set form default values
        setValue("bankName", info.bankName || "");
        setValue("accountNumber", info.accountNumber || "");
        setValue("accountName", info.accountName || "");

        if (info.qrCodeUrl) {
          setQrPreview(info.qrCodeUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching payment info:", error);
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

      // Resize and upload the image
      const resizedFile = await resizeFile(file);
      const uploadFormData = new FormData();
      uploadFormData.append("qrcode", resizedFile);
      uploadFormData.append("placeId", placeId);
      uploadFormData.append("userId", userId);

      const response = await uploadQRCodeAPI(uploadFormData);
      if (response.data.success) {
        setQrPreview(response.data.qrCodeUrl);
        toast.success("อัปโหลด QR Code สำเร็จ");
      }
    } catch (error) {
      console.error("Error uploading QR code:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด QR Code");
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleSubmit = async (data) => {
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
        userId: userId,
      };

      const response = await updatePaymentInfoAPI(placeId, submitData);

      if (response.data.success) {
        toast.success("อัปเดตข้อมูลการชำระเงินสำเร็จ");
        fetchPaymentInfo(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating payment info:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-500" />
            ข้อมูลการชำระเงิน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-500" />
          ข้อมูลการชำระเงิน
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit(handleSubmit)} className="space-y-6">
          {/* Bank Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">ธนาคาร</Label>
              <Select
                value={bankName}
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

            <EditInputForm
              id="accountNumber"
              name="accountNumber"
              label="เลขที่บัญชี"
              placeholder="xxx-x-xxxxx-x"
              register={register}
              validation={{
                required: "กรุณากรอกเลขที่บัญชี",
              }}
              errors={errors}
            />
          </div>

          <EditInputForm
            id="accountName"
            name="accountName"
            label="ชื่อบัญชี"
            placeholder="ชื่อบัญชีผู้รับเงิน"
            register={register}
            validation={{
              required: "กรุณากรอกชื่อบัญชี",
            }}
            errors={errors}
          />

          {/* QR Code Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <Label>QR Code สำหรับการชำระเงิน</Label>
            </div>

            {qrPreview && (
              <div className="relative">
                <img
                  src={qrPreview}
                  alt="QR Code"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  มี QR Code
                </Badge>
              </div>
            )}

            <FileUpload onChange={handleQRCodeUpload} />

            {!qrPreview && (
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
                  <CheckCircle className="w-4 h-4" />
                  บันทึกข้อมูลการชำระเงิน
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditPaymentInfoSection;
