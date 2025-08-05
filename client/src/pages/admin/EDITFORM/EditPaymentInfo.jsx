import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  CreditCard,
  QrCode,
  Upload,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPaymentInfoAPI,
  updatePaymentInfoAPI,
  uploadPaymentInfoAPI,
} from "@/api/paymentAPI";

const EditPaymentInfo = () => {
  const { id: placeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    qrCodeUrl: "",
    notes: "",
  });

  const bankOptions = [
    { value: "กสิกรไทย", label: "ธนาคารกสิกรไทย" },
    { value: "กรุงเทพ", label: "ธนาคารกรุงเทพ" },
    { value: "ไทยพาณิชย์", label: "ธนาคารไทยพาณิชย์" },
    { value: "กรุงไทย", label: "ธนาคารกรุงไทย" },
    { value: "กรุงศรีอยุธยา", label: "ธนาคารกรุงศรีอยุธยา" },
    { value: "ทหารไทยธนชาต", label: "ธนาคารทหารไทยธนชาต" },
    { value: "ออมสิน", label: "ธนาคารออมสิน" },
    { value: "อาคารสงเคราะห์", label: "ธนาคารอาคารสงเคราะห์" },
    { value: "เกียรตินาคินภัทร", label: "ธนาคารเกียรตินาคินภัทร" },
    { value: "ซีไอเอ็มบี ไทย", label: "ธนาคารซีไอเอ็มบี ไทย" },
    { value: "ยูโอบี", label: "ธนาคารยูโอบี" },
    { value: "แลนด์ แอนด์ เฮ้าส์", label: "ธนาคารแลนด์ แอนด์ เฮ้าส์" },
    { value: "ไอซีบีซี", label: "ธนาคารไอซีบีซี" },
  ];

  useEffect(() => {
    fetchPaymentInfo();
  }, [placeId]);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await getPaymentInfoAPI(placeId);

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setPaymentInfo(data);
        setFormData({
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          accountName: data.accountName || "",
          qrCodeUrl: data.qrCodeUrl || "",
          notes: data.notes || "",
        });
      } else {
        // ไม่มีข้อมูลการชำระเงิน - ใช้ข้อมูลเปล่า
        setPaymentInfo(null);
        setFormData({
          bankName: "",
          accountNumber: "",
          accountName: "",
          qrCodeUrl: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error fetching payment info:", error);
      // ถ้า error 404 แสดงว่าไม่มีข้อมูล ให้ใช้ form เปล่า
      if (error.response?.status === 404) {
        setPaymentInfo(null);
        setFormData({
          bankName: "",
          accountNumber: "",
          accountName: "",
          qrCodeUrl: "",
          notes: "",
        });
      } else {
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.accountName
    ) {
      toast.error("กรุณากรอกข้อมูลธนาคาร เลขบัญชี และชื่อบัญชีให้ครบถ้วน");
      return;
    }

    try {
      setSaving(true);

      const submitData = {
        ...formData,
        placeId: parseInt(placeId),
      };

      let response;
      if (paymentInfo) {
        // อัปเดตข้อมูลเดิม
        response = await updatePaymentInfoAPI(placeId, submitData);
      } else {
        // สร้างข้อมูลใหม่
        response = await uploadPaymentInfoAPI(placeId, submitData);
      }

      if (response.data.success) {
        toast.success(
          paymentInfo
            ? "อัปเดตข้อมูลการชำระเงินสำเร็จ"
            : "สร้างข้อมูลการชำระเงินสำเร็จ"
        );
        navigate("/admin/manage-list");
      } else {
        toast.error(response.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error saving payment info:", error);
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/manage-list")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {paymentInfo
              ? "แก้ไขข้อมูลการชำระเงิน"
              : "ตั้งค่าข้อมูลการชำระเงิน"}
          </h1>
          <p className="text-gray-600">
            กรอกข้อมูลธนาคารสำหรับรับชำระเงินจากลูกค้า
          </p>
        </div>
      </div>

      {/* Status Alert */}
      <Card
        className={`border-l-4 ${
          paymentInfo
            ? "border-l-green-500 bg-green-50"
            : "border-l-orange-500 bg-orange-50"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {paymentInfo ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
            <div>
              <p
                className={`font-medium ${
                  paymentInfo ? "text-green-800" : "text-orange-800"
                }`}
              >
                {paymentInfo
                  ? "มีข้อมูลการชำระเงินแล้ว"
                  : "ยังไม่มีข้อมูลการชำระเงิน"}
              </p>
              <p
                className={`text-sm ${
                  paymentInfo ? "text-green-600" : "text-orange-600"
                }`}
              >
                {paymentInfo
                  ? "ลูกค้าสามารถชำระเงินผ่านการโอนธนาคารได้"
                  : "ลูกค้าจะชำระเงินผ่านบัตรเครดิต/เดบิตเท่านั้น"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              ข้อมูลธนาคาร
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">ธนาคาร *</Label>
              <Select
                value={formData.bankName}
                onValueChange={(value) => handleInputChange("bankName", value)}
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
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">เลขที่บัญชี *</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="กรอกเลขที่บัญชี (ตัวเลขเท่านั้น)"
                value={formData.accountNumber}
                onChange={(e) => {
                  // ให้กรอกได้แค่ตัวเลข
                  const value = e.target.value.replace(/\D/g, "");
                  handleInputChange("accountNumber", value);
                }}
                maxLength={15}
              />
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName">ชื่อบัญชี *</Label>
              <Input
                id="accountName"
                type="text"
                placeholder="กรอกชื่อบัญชีธนาคาร"
                value={formData.accountName}
                onChange={(e) =>
                  handleInputChange("accountName", e.target.value)
                }
              />
            </div>

            <Separator />

            {/* QR Code URL */}
            <div className="space-y-2">
              <Label htmlFor="qrCodeUrl" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Code PromptPay (ไม่บังคับ)
              </Label>
              <Input
                id="qrCodeUrl"
                type="url"
                placeholder="URL ของ QR Code PromptPay"
                value={formData.qrCodeUrl}
                onChange={(e) => handleInputChange("qrCodeUrl", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                สามารถอัปโหลด QR Code ไปยัง cloud storage และนำ URL มาใส่ที่นี่
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">หมายเหตุเพิ่มเติม</Label>
              <Textarea
                id="notes"
                placeholder="ข้อมูลเพิ่มเติมสำหรับลูกค้า เช่น เวลาทำการตรวจสอบ หรือข้อมูลติดต่อ"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {(formData.bankName ||
          formData.accountNumber ||
          formData.accountName) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                ตัวอย่างข้อมูลที่ลูกค้าจะเห็น
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">ข้อมูลการโอนเงิน</span>
                </div>

                {formData.bankName && (
                  <div className="text-sm">
                    <strong>ธนาคาร:</strong> {formData.bankName}
                  </div>
                )}

                {formData.accountNumber && (
                  <div className="text-sm">
                    <strong>เลขบัญชี:</strong> {formData.accountNumber}
                  </div>
                )}

                {formData.accountName && (
                  <div className="text-sm">
                    <strong>ชื่อบัญชี:</strong> {formData.accountName}
                  </div>
                )}

                {formData.qrCodeUrl && (
                  <div className="flex items-center gap-2 mt-2">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      มี QR Code PromptPay
                    </span>
                  </div>
                )}

                {formData.notes && (
                  <div className="text-sm text-gray-600 mt-3 pt-3 border-t">
                    <strong>หมายเหตุ:</strong> {formData.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/manage-list")}
            className="flex-1"
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={
              saving ||
              !formData.bankName ||
              !formData.accountNumber ||
              !formData.accountName
            }
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังบันทึก...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {paymentInfo ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPaymentInfo;
