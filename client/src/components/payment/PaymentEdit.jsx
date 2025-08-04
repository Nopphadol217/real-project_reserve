import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Upload,
  Trash2,
  QrCode,
  Eye,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const PaymentEdit = ({
  paymentInfo,
  onSave,
  onCancel,
  isOpen,
  onOpenChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrPreview, setQrPreview] = useState(null);
  const [showQrPreview, setShowQrPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      promptPayId: "",
      notes: "",
    },
  });

  // อัปเดตค่าเริ่มต้นเมื่อ paymentInfo เปลี่ยน
  useEffect(() => {
    if (paymentInfo) {
      reset({
        accountName: paymentInfo.accountName || "",
        accountNumber: paymentInfo.accountNumber || "",
        bankName: paymentInfo.bankName || "",
        promptPayId: paymentInfo.promptPayId || "",
        notes: paymentInfo.notes || "",
      });
      setQrPreview(paymentInfo.qrCodeUrl || null);
    }
  }, [paymentInfo, reset]);

  const bankOptions = [
    { value: "กสิกรไทย", label: "ธนาคารกสิกรไทย" },
    { value: "กรุงเทพ", label: "ธนาคารกรุงเทพ" },
    { value: "กรุงไทย", label: "ธนาคารกรุงไทย" },
    { value: "ทีเอ็มบี", label: "ธนาคารทีเอ็มบีธนชาต" },
    { value: "ไทยพาณิชย์", label: "ธนาคารไทยพาณิชย์" },
    { value: "กรุงศรีอยุธยา", label: "ธนาคารกรุงศรีอยุธยา" },
    { value: "ออมสิน", label: "ธนาคารออมสิน" },
    { value: "อิสลาม", label: "ธนาคารอิสลามแห่งประเทศไทย" },
    { value: "เกียรตินาคิน", label: "ธนาคารเกียรตินาคินภัทร" },
    { value: "ซีไอเอ็มบี", label: "ธนาคารซีไอเอ็มบี ไทย" },
  ];

  const handleQrUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ตรวจสอบไฟล์
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB");
      return;
    }

    // สร้าง preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQr = () => {
    setQrPreview(null);
    // เคลียร์ input file
    const fileInput = document.getElementById("qr-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // เตรียมข้อมูลสำหรับส่ง
      const formData = new FormData();
      formData.append("accountName", data.accountName);
      formData.append("accountNumber", data.accountNumber);
      formData.append("bankName", data.bankName);
      formData.append("promptPayId", data.promptPayId || "");
      formData.append("notes", data.notes || "");

      // เพิ่มไฟล์ QR Code ถ้ามี
      const fileInput = document.getElementById("qr-upload");
      if (fileInput?.files[0]) {
        formData.append("qrCode", fileInput.files[0]);
      }

      await onSave(formData);
      toast.success("บันทึกข้อมูลการชำระเงินสำเร็จ");
    } catch (error) {
      console.error("Error saving payment info:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setQrPreview(paymentInfo?.qrCodeUrl || null);
    onCancel?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            แก้ไขข้อมูลการรับชำระเงิน
          </DialogTitle>
          <DialogDescription>
            อัปเดตข้อมูลบัญชีธนาคารและ QR Code PromptPay สำหรับรับชำระเงิน
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ข้อมูลบัญชีธนาคาร */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5" />
                ข้อมูลบัญชีธนาคาร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">ชื่อบัญชี *</Label>
                  <Input
                    id="accountName"
                    placeholder="นาย/นาง/นางสาว ชื่อ นามสกุล"
                    {...register("accountName", {
                      required: "กรุณากรอกชื่อบัญชี",
                    })}
                  />
                  {errors.accountName && (
                    <p className="text-sm text-red-500">
                      {errors.accountName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">เลขที่บัญชี *</Label>
                  <Input
                    id="accountNumber"
                    placeholder="xxx-x-xxxxx-x"
                    {...register("accountNumber", {
                      required: "กรุณากรอกเลขที่บัญชี",
                      pattern: {
                        value: /^[0-9-]+$/,
                        message: "เลขที่บัญชีควรมีเฉพาะตัวเลขและเครื่องหมาย -",
                      },
                    })}
                  />
                  {errors.accountNumber && (
                    <p className="text-sm text-red-500">
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">ธนาคาร *</Label>
                <Select
                  value={watch("bankName")}
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
                  <p className="text-sm text-red-500">กรุณาเลือกธนาคาร</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PromptPay */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <QrCode className="w-5 h-5" />
                PromptPay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promptPayId">หมายเลข PromptPay</Label>
                <Input
                  id="promptPayId"
                  placeholder="เบอร์โทรศัพท์หรือเลขบัตรประชาชน"
                  {...register("promptPayId")}
                />
                <p className="text-sm text-gray-500">
                  สามารถใส่หมายเลขโทรศัพท์หรือเลขบัตรประชาชนที่ลงทะเบียน
                  PromptPay
                </p>
              </div>

              <div className="space-y-2">
                <Label>QR Code PromptPay</Label>
                <div className="flex flex-col space-y-3">
                  {qrPreview && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={qrPreview}
                        alt="QR Code Preview"
                        className="w-24 h-24 object-cover border rounded-lg"
                      />
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowQrPreview(true)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ดูเต็ม
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveQr}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          ลบ
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      id="qr-upload"
                      accept="image/*"
                      onChange={handleQrUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("qr-upload")?.click()
                      }
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {qrPreview ? "เปลี่ยน QR Code" : "อัปโหลด QR Code"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* หมายเหตุ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">หมายเหตุเพิ่มเติม</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">หมายเหตุ</Label>
                <Textarea
                  id="notes"
                  placeholder="หมายเหตุสำหรับลูกค้า เช่น ชื่อบัญชีต้องตรงกับที่โอน"
                  rows={3}
                  {...register("notes")}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-1" />
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-1" />
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </form>

        {/* Dialog แสดง QR Code แบบเต็ม */}
        <Dialog open={showQrPreview} onOpenChange={setShowQrPreview}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code PromptPay</DialogTitle>
            </DialogHeader>
            {qrPreview && (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={qrPreview}
                  alt="QR Code"
                  className="max-w-full h-auto rounded-lg border"
                  style={{ maxHeight: "400px" }}
                />
                <Button
                  variant="outline"
                  onClick={() => window.open(qrPreview, "_blank")}
                >
                  เปิดในแท็บใหม่
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentEdit;
