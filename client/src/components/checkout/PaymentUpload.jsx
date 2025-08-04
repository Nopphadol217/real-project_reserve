import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import { uploadPaymentSlipAPI } from "@/api/paymentAPI";

const PaymentUpload = ({ booking, paymentInfo, onPaymentUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [slipPreview, setSlipPreview] = useState(null);
  const [showQrDialog, setShowQrDialog] = useState(false);

  const getPaymentStatusInfo = (status) => {
    const statusConfig = {
      unpaid: {
        label: "ยังไม่ชำระเงิน",
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
        description: "กรุณาทำการชำระเงินและอัปโหลดสลิปการโอนเงิน",
      },
      pending: {
        label: "รอตรวจสอบ",
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
        description: "ส่งสลิปการโอนเงินแล้ว รอการตรวจสอบจากเจ้าหน้าที่",
      },
      paid: {
        label: "ชำระเงินแล้ว",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        description: "การชำระเงินได้รับการยืนยันแล้ว",
      },
      rejected: {
        label: "ปฏิเสธ",
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        description: "การชำระเงินถูกปฏิเสธ กรุณาส่งสลิปใหม่",
      },
    };

    return statusConfig[status] || statusConfig.unpaid;
  };

  const handleSlipUpload = async (event) => {
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

    // สร้าง preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSlipPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      await uploadPaymentSlipAPI(booking.id, file);
      toast.success("อัปโหลดสลิปการโอนเงินสำเร็จ");
      onPaymentUploaded?.();
    } catch (error) {
      console.error("Error uploading slip:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดสลิป");
      setSlipPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusInfo = getPaymentStatusInfo(booking.paymentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* ข้อมูลการจอง */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            รายละเอียดการจอง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  ที่พัก
                </Label>
                <p className="text-lg font-semibold">{booking.Place?.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  ห้อง
                </Label>
                <p className="text-lg">{booking.Room?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  วันที่เข้าพัก
                </Label>
                <p>
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  ยอดรวม
                </Label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(booking.totalPrice)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  สถานะการชำระเงิน
                </Label>
                <Badge
                  className={`${statusInfo.color} flex items-center gap-1 w-fit`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusInfo.label}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">
                  {statusInfo.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ข้อมูลการโอนเงิน */}
      {paymentInfo && (
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการโอนเงิน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    ชื่อบัญชี
                  </Label>
                  <p className="text-lg font-semibold">
                    {paymentInfo.accountName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    ธนาคาร
                  </Label>
                  <p>{paymentInfo.bankName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    เลขที่บัญชี
                  </Label>
                  <p className="font-mono text-lg">
                    {paymentInfo.accountNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    QR Code PromptPay
                  </Label>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowQrDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      ดู QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* อัปโหลดสลิป */}
      {(booking.paymentStatus === "unpaid" ||
        booking.paymentStatus === "rejected") && (
        <Card>
          <CardHeader>
            <CardTitle>อัปโหลดสลิปการโอนเงิน</CardTitle>
          </CardHeader>
          <CardContent>
            {!slipPreview && !booking.paymentSlip ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    อัปโหลดสลิปการโอนเงิน
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB
                  </p>
                  <Button variant="outline" disabled={isUploading} asChild>
                    <label htmlFor="slip-upload" className="cursor-pointer">
                      {isUploading ? "กำลังอัปโหลด..." : "เลือกไฟล์"}
                    </label>
                  </Button>
                  <input
                    id="slip-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleSlipUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={slipPreview || booking.paymentSlip}
                    alt="Payment Slip"
                    className="max-w-md mx-auto rounded-lg border"
                  />
                </div>
                {booking.paymentStatus === "rejected" && (
                  <div className="text-center">
                    <Button variant="outline" asChild>
                      <label htmlFor="slip-upload" className="cursor-pointer">
                        อัปโหลดสลิปใหม่
                      </label>
                    </Button>
                    <input
                      id="slip-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* แสดงสลิปที่อัปโหลดแล้ว */}
      {booking.paymentSlip && booking.paymentStatus === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              สลิปการโอนเงิน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <img
                src={booking.paymentSlip}
                alt="Uploaded Payment Slip"
                className="max-w-md mx-auto rounded-lg border"
              />
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">
                  ✓ อัปโหลดสลิปเรียบร้อยแล้ว
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  รอการตรวจสอบจากเจ้าหน้าที่ ประมาณ 1-2 ชั่วโมง
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* การชำระเงินสำเร็จ */}
      {booking.paymentStatus === "paid" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                การชำระเงินสำเร็จ!
              </h3>
              <p className="text-green-600">
                การจองของคุณได้รับการยืนยันแล้ว คุณสามารถเข้าพักได้ตามวันที่จอง
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog แสดง QR Code */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code PromptPay</DialogTitle>
          </DialogHeader>
          {paymentInfo?.qrCodeUrl && (
            <div className="text-center">
              <img
                src={paymentInfo.qrCodeUrl}
                alt="QR Code PromptPay"
                className="max-w-full mx-auto rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-4">
                สแกน QR Code เพื่อชำระเงิน จำนวน{" "}
                {formatCurrency(booking.totalPrice)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentUpload;
