import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  QrCode,
  Edit3,
  Plus,
  CheckCircle,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import PaymentEdit from "@/components/payment/PaymentEdit";
import {
  getBusinessPaymentInfoAPI,
  updateBusinessPaymentInfoAPI,
  createBusinessPaymentInfoAPI,
} from "@/api/paymentAPI";

const PaymentSettings = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showQrPreview, setShowQrPreview] = useState(false);

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await getBusinessPaymentInfoAPI();
      setPaymentInfo(response.data.data);
    } catch (error) {
      console.error("Error fetching payment info:", error);
      if (error.response?.status !== 404) {
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentInfo = async (formData) => {
    try {
      let response;
      if (paymentInfo) {
        // อัปเดต
        response = await updateBusinessPaymentInfoAPI(formData);
      } else {
        // สร้างใหม่
        response = await createBusinessPaymentInfoAPI(formData);
      }

      setPaymentInfo(response.data.data);
      setShowEditDialog(false);
      toast.success("บันทึกข้อมูลการชำระเงินสำเร็จ");
    } catch (error) {
      console.error("Error saving payment info:", error);
      throw error;
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
    <div className="space-y-6 mx-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ตั้งค่าการรับชำระเงิน
          </h1>
          <p className="text-gray-600 mt-1">
            จัดการข้อมูลบัญชีธนาคารและ QR Code PromptPay
          </p>
        </div>
        <Button
          onClick={() => setShowEditDialog(true)}
          className="flex items-center gap-2"
        >
          {paymentInfo ? (
            <>
              <Edit3 className="w-4 h-4" />
              แก้ไขข้อมูล
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              เพิ่มข้อมูลการชำระเงิน
            </>
          )}
        </Button>
      </div>

      {!paymentInfo ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            คุณยังไม่ได้ตั้งค่าข้อมูลการรับชำระเงิน
            ลูกค้าจะไม่สามารถชำระเงินผ่านการโอนธนาคารได้
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            ข้อมูลการรับชำระเงินของคุณพร้อมใช้งานแล้ว
          </AlertDescription>
        </Alert>
      )}

      {/* ข้อมูลการชำระเงินปัจจุบัน */}
      {paymentInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ข้อมูลบัญชีธนาคาร */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                ข้อมูลบัญชีธนาคาร
                <Badge variant="success" className="ml-auto">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  พร้อมใช้งาน
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">ชื่อบัญชี</p>
                <p className="font-medium">{paymentInfo.accountName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">เลขที่บัญชี</p>
                <p className="font-medium font-mono">
                  {paymentInfo.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ธนาคาร</p>
                <p className="font-medium">{paymentInfo.bankName}</p>
              </div>
              {paymentInfo.promptPayId && (
                <div>
                  <p className="text-sm text-gray-600">PromptPay ID</p>
                  <p className="font-medium font-mono">
                    {paymentInfo.promptPayId}
                  </p>
                </div>
              )}
              {paymentInfo.notes && (
                <div>
                  <p className="text-sm text-gray-600">หมายเหตุ</p>
                  <p className="text-sm">{paymentInfo.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code PromptPay
                {paymentInfo.qrCodeUrl ? (
                  <Badge variant="success" className="ml-auto">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    พร้อมใช้งาน
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="ml-auto">
                    ยังไม่ได้อัปโหลด
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentInfo.qrCodeUrl ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={paymentInfo.qrCodeUrl}
                      alt="QR Code PromptPay"
                      className="w-48 h-48 object-contain border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQrPreview(true)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      ดูเต็มหน้าจอ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(paymentInfo.qrCodeUrl, "_blank")
                      }
                    >
                      เปิดในแท็บใหม่
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ยังไม่มี QR Code
                  </h3>
                  <p className="text-gray-600 mb-4">
                    อัปโหลด QR Code PromptPay เพื่อให้ลูกค้าสแกนชำระเงินได้สะดวก
                  </p>
                  <Button
                    onClick={() => setShowEditDialog(true)}
                    variant="outline"
                  >
                    อัปโหลด QR Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* คำแนะนำ */}
      <Card>
        <CardHeader>
          <CardTitle>คำแนะนำการใช้งาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">ข้อมูลบัญชีธนาคาร</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• ตรวจสอบความถูกต้องของชื่อบัญชีและเลขที่บัญชี</li>
                <li>• ชื่อบัญชีควรตรงกับเอกสารประกอบการสมัครสมาชิก</li>
                <li>• สามารถใส่หมายเหตุเพิ่มเติมสำหรับลูกค้า</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">QR Code PromptPay</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• ใช้ QR Code จากแอป Mobile Banking ของธนาคาร</li>
                <li>• ไฟล์รูปภาพควรชัดเจนและสแกนได้</li>
                <li>• รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog แก้ไขข้อมูล */}
      <PaymentEdit
        paymentInfo={paymentInfo}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSavePaymentInfo}
        onCancel={() => setShowEditDialog(false)}
      />

      {/* Dialog แสดง QR Code เต็มหน้าจอ */}
      {paymentInfo?.qrCodeUrl && (
        <Dialog open={showQrPreview} onOpenChange={setShowQrPreview}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code PromptPay</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={paymentInfo.qrCodeUrl}
                alt="QR Code"
                className="max-w-full h-auto rounded-lg border"
                style={{ maxHeight: "500px" }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentSettings;
