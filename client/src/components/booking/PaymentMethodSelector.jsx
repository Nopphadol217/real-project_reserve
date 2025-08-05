import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Building2,
  ArrowLeft,
  CheckCircle,
  QrCode,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { createBookingAPI } from "@/api/bookingAPI";
import { getPaymentInfoAPI } from "@/api/paymentAPI";
import PaymentUpload from "@/components/checkout/PaymentUpload";

const PaymentMethodSelector = ({
  bookingData,
  paymentInfo,
  onBack,
  onSelectPaymentMethod,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [placePaymentInfo, setPlacePaymentInfo] = useState(null);
  const navigate = useNavigate();

  // ดึงข้อมูลการชำระเงินของที่พักนี้
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        if (bookingData.placeId) {
          const response = await getPaymentInfoAPI(bookingData.placeId);
          if (response.data.success && response.data.data) {
            setPlacePaymentInfo(response.data.data);
          } else {
            // ไม่มีข้อมูลการชำระเงิน - ตั้งค่าเป็น null
            setPlacePaymentInfo(null);
          }
        }
      } catch (error) {
        console.error("Error fetching payment info:", error);
        // ถ้า error ให้ตั้งค่าเป็น null
        setPlacePaymentInfo(null);
      }
    };

    fetchPaymentInfo();
  }, [bookingData.placeId]);

  const paymentMethods = [
    {
      id: "stripe",
      name: "บัตรเครดิต/เดบิต",
      description: "ชำระเงินผ่าน Stripe (รวดเร็ว ปลอดภัย)",
      icon: CreditCard,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      available: true,
    },
    {
      id: "bank_transfer",
      name: "โอนเงินผ่านธนาคาร",
      description: "โอนเงินเข้าบัญชีธนาคารและอัปโหลดสลิป",
      icon: Building2,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      available: true, // เปิดให้ใช้งานเสมอ แต่จะแสดงข้อความเตือนถ้าไม่มีข้อมูล
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method.id);

    // แสดงข้อความเตือนสำหรับ bank transfer ถ้าไม่มีข้อมูล
    if (method.id === "bank_transfer" && !placePaymentInfo) {
      toast.warning(
        "เจ้าของที่พักยังไม่ได้ตั้งค่าข้อมูลการรับชำระเงิน กรุณาติดต่อเจ้าของที่พักสำหรับรายละเอียดการโอนเงิน"
      );
    }

    // ส่งข้อมูลกลับไปยัง BookingContainer
    if (onSelectPaymentMethod) {
      onSelectPaymentMethod(method.id);
    }
  };

  const handlePaymentProcess = async () => {
    if (!selectedMethod) return;

    try {
      setIsProcessing(true);

      if (selectedMethod === "stripe") {
        // สำหรับ Stripe - redirect ไป Stripe Checkout
        navigate(`/checkout/${bookingData.placeId}`, {
          state: { bookingData },
        });
      } else if (selectedMethod === "bank_transfer") {
        // ตรวจสอบว่ามีข้อมูลการชำระเงินหรือไม่
        if (!placePaymentInfo) {
          toast.error(
            "ไม่สามารถดำเนินการได้ เนื่องจากเจ้าของที่พักยังไม่ได้ตั้งค่าข้อมูลการรับชำระเงิน กรุณาติดต่อเจ้าของที่พักโดยตรง"
          );
          return;
        }

        // สำหรับ Bank Transfer - สร้าง booking แล้วไปหน้าอัปโหลดสลิป
        const response = await createBookingAPI({
          ...bookingData,
          paymentMethod: "bank_transfer",
        });

        if (response.data.success) {
          setCreatedBooking(response.data.data);
          toast.success("สร้างการจองสำเร็จ กรุณาชำระเงินและอัปโหลดสลิป");
        }
      }
    } catch (error) {
      console.error("Payment process error:", error);

      // แสดง error message ที่ชัดเจน
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("เกิดข้อผิดพลาดในการดำเนินการ");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentUploaded = () => {
    toast.success("อัปโหลดสลิปสำเร็จ รอการตรวจสอบจากเจ้าหน้าที่");
    navigate("/user/mybookings");
  };

  // ถ้าสร้าง booking แล้วและเลือก bank transfer ให้แสดงหน้าอัปโหลดสลิป
  if (createdBooking && selectedMethod === "bank_transfer") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h2 className="text-2xl font-bold">ชำระเงินผ่านธนาคาร</h2>
            <p className="text-gray-600">
              กรุณาโอนเงินและอัปโหลดสลิปการโอนเงิน
            </p>
          </div>
        </div>

        <PaymentUpload
          booking={createdBooking}
          paymentInfo={placePaymentInfo}
          onPaymentUploaded={handlePaymentUploaded}
        />
      </div>
    );
  }

  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const totalPrice = nights * bookingData.price;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>
        <div>
          <h2 className="text-2xl font-bold">เลือกวิธีการชำระเงิน</h2>
          <p className="text-gray-600">เลือกวิธีการที่คุณต้องการชำระเงิน</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold mb-4">วิธีการชำระเงิน</h3>

          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : method.available
                    ? "hover:shadow-md border-gray-200"
                    : "opacity-50 cursor-not-allowed"
                } ${method.color}`}
                onClick={() => handleMethodSelect(method)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg bg-white ${method.iconColor}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {method.name}
                          </h4>
                          {!method.available && (
                            <Badge variant="secondary">ไม่พร้อมใช้งาน</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>

                        {/* แสดงข้อมูลเพิ่มเติมสำหรับ bank transfer */}
                        {method.id === "bank_transfer" && (
                          <div className="mt-3 p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium">
                                ข้อมูลการโอนเงิน
                              </span>
                            </div>

                            {placePaymentInfo ? (
                              <div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>
                                    <strong>ธนาคาร:</strong>{" "}
                                    {placePaymentInfo.bankName}
                                  </p>
                                  <p>
                                    <strong>เลขบัญชี:</strong>{" "}
                                    {placePaymentInfo.accountNumber}
                                  </p>
                                  <p>
                                    <strong>ชื่อบัญชี:</strong>{" "}
                                    {placePaymentInfo.accountName}
                                  </p>
                                </div>
                                {placePaymentInfo.qrCodeUrl && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <QrCode className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-blue-600">
                                      มี QR Code PromptPay
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                <p>
                                  ⚠️
                                  เจ้าของที่พักยังไม่ได้ตั้งค่าข้อมูลการรับชำระเงิน
                                </p>
                                <p className="text-xs mt-1">
                                  กรุณาเลือกการชำระผ่านบัตรเครดิต/เดบิต
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                สรุปการจอง
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">ที่พัก</p>
                  <p className="font-medium">{bookingData.placeTitle}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600">วันที่เข้าพัก</p>
                  <p className="font-medium">
                    {formatDate(bookingData.checkIn)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">วันที่ออก</p>
                  <p className="font-medium">
                    {formatDate(bookingData.checkOut)}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ราคาต่อคืน</span>
                    <span>{formatCurrency(bookingData.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>จำนวนคืน</span>
                    <span>{nights} คืน</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>ยอดรวม</span>
                  <span className="text-green-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handlePaymentProcess}
                disabled={!selectedMethod || isProcessing}
              >
                {isProcessing
                  ? "กำลังดำเนินการ..."
                  : selectedMethod === "stripe"
                  ? "ไปหน้าชำระเงิน"
                  : selectedMethod === "bank_transfer"
                  ? "ยืนยันการจอง"
                  : "เลือกวิธีการชำระเงิน"}
              </Button>

              {selectedMethod && (
                <p className="text-xs text-gray-500 text-center">
                  {selectedMethod === "stripe"
                    ? "คุณจะถูกนำไปยังหน้าชำระเงินที่ปลอดภัย"
                    : "หลังจากยืนยันแล้วกรุณาโอนเงินและอัปโหลดสลิป"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
