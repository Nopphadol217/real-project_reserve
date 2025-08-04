import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, CreditCard, QrCode, Trash2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { uploadQRCodeAPI, deleteQRCodeAPI } from "@/api/paymentAPI";
import { resizeFile } from "@/utils/resizeFile";

const UploadPaymentInfo = ({ onPaymentInfoChange, initialData = null }) => {
  const [paymentInfo, setPaymentInfo] = useState({
    accountName: initialData?.accountName || "",
    bankName: initialData?.bankName || "",
    accountNumber: initialData?.accountNumber || "",
    qrCodeFile: null,
    qrCodeUrl: initialData?.qrCodeUrl || "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [qrPreview, setQrPreview] = useState(initialData?.qrCodeUrl || null);

  const banks = [
    "ธนาคารกรุงเทพ",
    "ธนาคารกสิกรไทย",
    "ธนาคารไทยพาณิชย์",
    "ธนาคารกรุงไทย",
    "ธนาคารทหารไทยธนชาต",
    "ธนาคารกรุงศรีอยุธยา",
    "ธนาคารออมสิน",
    "ธนาคารอาคารสงเคราะห์",
    "ธนาคารเกียรตินาคินภัทร",
    "ธนาคารซีไอเอ็มบี ไทย",
    "ธนาคารยูโอบี",
    "ธนาคารแลนด์ แอนด์ เฮ้าส์",
    "ธนาคารไอซีบีซี (ไทย)",
  ];

  const handleInputChange = (field, value) => {
    const newPaymentInfo = { ...paymentInfo, [field]: value };
    setPaymentInfo(newPaymentInfo);
    onPaymentInfoChange?.(newPaymentInfo);
  };

  const handleQrCodeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ตรวจสอบไฟล์
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ไม่ควรเกิน 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // สร้าง preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // อัปโหลดไปยัง Cloudinary
      const formData = new FormData();
      formData.append("qrCode", file);

      const response = await uploadQRCodeAPI(formData);

      if (response.data.success) {
        const uploadedData = response.data.result;

        const newPaymentInfo = {
          ...paymentInfo,
          qrCodeFile: file,
          qrCodeUrl: uploadedData.secure_url,
          qrCodePublicId: uploadedData.public_id,
        };

        setPaymentInfo(newPaymentInfo);
        onPaymentInfoChange?.(newPaymentInfo);

        toast.success("อัปโหลด QR Code สำเร็จ");
      }
    } catch (error) {
      console.error("Error uploading QR Code:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด QR Code");

      // รีเซ็ต preview หากอัปโหลดไม่สำเร็จ
      setQrPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeQrCode = async () => {
    try {
      // ลบจาก Cloudinary ถ้ามี public_id
      if (paymentInfo.qrCodePublicId) {
        await deleteQRCodeAPI(paymentInfo.qrCodePublicId);
      }

      setQrPreview(null);
      const newPaymentInfo = {
        ...paymentInfo,
        qrCodeFile: null,
        qrCodeUrl: "",
        qrCodePublicId: "",
      };
      setPaymentInfo(newPaymentInfo);
      onPaymentInfoChange?.(newPaymentInfo);

      // Reset input file
      const fileInput = document.getElementById("qr-code-upload");
      if (fileInput) fileInput.value = "";

      toast.success("ลบ QR Code สำเร็จ");
    } catch (error) {
      console.error("Error deleting QR Code:", error);
      toast.error("เกิดข้อผิดพลาดในการลบ QR Code");
    }
  };

  const validateForm = () => {
    return (
      paymentInfo.accountName.trim() &&
      paymentInfo.bankName &&
      paymentInfo.accountNumber.trim() &&
      (paymentInfo.qrCodeUrl || paymentInfo.qrCodeFile)
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          ข้อมูลการรับชำระเงิน
        </CardTitle>
        <p className="text-sm text-gray-600">
          เพิ่มข้อมูลบัญชีธนาคารและ QR Code PromptPay สำหรับรับชำระเงินจากลูกค้า
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* ข้อมูลบัญชีธนาคาร */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">ข้อมูลบัญชีธนาคาร</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">ชื่อบัญชี</Label>
              <Input
                id="account-name"
                placeholder="ชื่อเจ้าของบัญชี"
                value={paymentInfo.accountName}
                onChange={(e) =>
                  handleInputChange("accountName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank-name">ธนาคาร</Label>
              <select
                id="bank-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={paymentInfo.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
              >
                <option value="">เลือกธนาคาร</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account-number">เลขที่บัญชี</Label>
            <Input
              id="account-number"
              placeholder="เลขที่บัญชีธนาคาร (เฉพาะตัวเลข)"
              value={paymentInfo.accountNumber}
              onChange={(e) => {
                // อนุญาตเฉพาะตัวเลขและขีด
                const value = e.target.value.replace(/[^0-9-]/g, "");
                handleInputChange("accountNumber", value);
              }}
              maxLength={15}
            />
          </div>
        </div>

        <Separator />

        {/* QR Code PromptPay */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code PromptPay
          </h3>

          <div className="space-y-4">
            {!qrPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  {isUploading ? (
                    <RotateCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  )}
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {isUploading
                      ? "กำลังอัปโหลด..."
                      : "อัปโหลด QR Code PromptPay"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                  </p>
                  <Button variant="outline" asChild disabled={isUploading}>
                    <label
                      htmlFor="qr-code-upload"
                      className={`cursor-pointer ${
                        isUploading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      {isUploading ? "กำลังอัปโหลด..." : "เลือกไฟล์"}
                    </label>
                  </Button>
                  <input
                    id="qr-code-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleQrCodeUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={qrPreview}
                    alt="QR Code Preview"
                    className="w-64 h-64 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeQrCode}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <label htmlFor="qr-code-upload" className="cursor-pointer">
                      เปลี่ยนรูป
                    </label>
                  </Button>
                  <input
                    id="qr-code-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleQrCodeUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* สถานะการกรอกข้อมูล */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                สถานะการกรอกข้อมูล:{" "}
                <span
                  className={validateForm() ? "text-green-600" : "text-red-600"}
                >
                  {validateForm() ? "ครบถ้วน" : "ไม่ครบถ้วน"}
                </span>
              </p>
              {!validateForm() && (
                <p className="text-sm text-gray-600 mt-1">
                  กรุณากรอกข้อมูลให้ครบถ้วนและอัปโหลด QR Code
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPaymentInfo;
