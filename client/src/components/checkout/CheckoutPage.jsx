import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Shield,
  Clock,
  Banknote,
} from "lucide-react";

const CheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Mock booking data - in real app, fetch from API using bookingId
  const [bookingData] = useState({
    id: bookingId,
    place: {
      title: "บ้านพักริมทะเล",
      category: "Beach House",
      image: "/api/placeholder/300/200",
      location: "เกาะสมุย, สุราษฎร์ธานี",
    },
    dates: {
      checkIn: "2025-08-01",
      checkOut: "2025-08-03",
      nights: 2,
    },
    guests: 2,
    pricing: {
      basePrice: 2500,
      subtotal: 5000,
      serviceFee: 600,
      tax: 400,
      total: 6000,
    },
    status: "pending",
  });

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Different handling for different payment methods
      if (paymentMethod === "cash") {
        // For cash payment, just confirm the reservation
        console.log(
          "Cash payment selected - booking confirmed for on-site payment"
        );
        // In real app, you would update the booking status to "confirmed" with payment method "cash"
      } else if (paymentMethod === "bank-transfer") {
        // For bank transfer, redirect to payment upload page
        console.log("Bank transfer selected - redirect to payment upload");
      } else {
        // For credit card, process payment
        console.log("Credit card payment processing");
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Navigate to success page
      navigate(`/booking-success/${bookingId}`);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </button>
          <h1 className="text-3xl font-bold text-gray-900">ชำระเงิน</h1>
          <p className="text-gray-600 mt-2">รหัสการจอง: #{bookingId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Place Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  รายละเอียดที่พัก
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <img
                    src={bookingData.place.image}
                    alt={bookingData.place.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {bookingData.place.title}
                    </h3>
                    <p className="text-gray-600">
                      {bookingData.place.category}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {bookingData.place.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Guest Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  วันที่เข้าพัก
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">เช็คอิน</p>
                    <p className="font-medium">
                      {formatDate(bookingData.dates.checkIn)}
                    </p>
                    <p className="text-sm text-gray-500">หลัง 15:00 น.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">เช็คเอาท์</p>
                    <p className="font-medium">
                      {formatDate(bookingData.dates.checkOut)}
                    </p>
                    <p className="text-sm text-gray-500">ก่อน 11:00 น.</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{bookingData.guests} ผู้เข้าพัก</span>
                    <Clock className="w-4 h-4 ml-4 mr-2 text-gray-500" />
                    <span>{bookingData.dates.nights} คืน</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  วิธีการชำระเงิน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Credit Card */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "credit-card"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("credit-card")}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "credit-card"}
                      onChange={() => setPaymentMethod("credit-card")}
                      className="text-blue-600"
                    />
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">บัตรเครดิต/เดบิต</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8 mt-1">
                    Visa, Mastercard, JCB
                  </p>
                </div>

                {/* Bank Transfer */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "bank-transfer"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("bank-transfer")}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "bank-transfer"}
                      onChange={() => setPaymentMethod("bank-transfer")}
                      className="text-blue-600"
                    />
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">โอนเงินผ่านธนาคาร</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8 mt-1">
                    โอนภายใน 24 ชั่วโมง
                  </p>
                </div>

                {/* Cash Payment */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "cash"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="text-blue-600"
                    />
                    <Banknote className="w-5 h-5" />
                    <span className="font-medium">ชำระเงินสด</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8 mt-1">
                    ชำระเงินสดหน้าที่พัก เมื่อเช็คอิน
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">
                      การรักษาความปลอดภัย
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      ข้อมูลการชำระเงินของคุณได้รับการป้องกันด้วยระบบเข้ารหัส
                      SSL 256-bit และเราไม่เก็บข้อมูลบัตรเครดิตของคุณ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>สรุปค่าใช้จ่าย</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>
                      ค่าที่พัก (฿
                      {bookingData.pricing.basePrice.toLocaleString()} ×{" "}
                      {bookingData.dates.nights} คืน)
                    </span>
                    <span>
                      ฿{bookingData.pricing.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าธรรมเนียมการบริการ</span>
                    <span>
                      ฿{bookingData.pricing.serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ภาษี</span>
                    <span>฿{bookingData.pricing.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span className="text-green-600">
                      ฿{bookingData.pricing.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      กำลังดำเนินการ...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      ชำระเงิน ฿{bookingData.pricing.total.toLocaleString()}
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center mt-4">
                  โดยการคลิก "ชำระเงิน" คุณยอมรับ
                  <a href="#" className="text-blue-600 hover:underline ml-1">
                    ข้อกำหนดและเงื่อนไข
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
