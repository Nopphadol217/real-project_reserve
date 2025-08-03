import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  CheckCircle,
  XCircle,
  Loader2,
  PartyPopper,
  Gift,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { checkOutStatus } from "../../api/bookingAPI";

const Complete = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!session_id) {
          setStatus("error");
          setMessage("ไม่พบข้อมูล session");
          return;
        }

        console.log("Verifying payment for session:", session_id);
        const response = await checkOutStatus(session_id);

        if (response.status === "complete") {
          setStatus("success");
          setMessage(response.message);
          setBooking(response.booking);
        } else {
          setStatus("error");
          setMessage("การชำระเงินไม่สำเร็จ");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage("เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน");
      }
    };

    verifyPayment();
  }, [session_id]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleViewBookings = () => {
    navigate("/user/myorder");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              กำลังตรวจสอบการชำระเงิน...
            </h2>
            <p className="text-gray-600">กรุณารอสักครู่</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              หน้าหลัก
            </Button>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  status === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {status === "success"
                    ? "ชำระเงินสำเร็จ!"
                    : "การชำระเงินไม่สำเร็จ"}
                </h1>
                <p className="text-sm text-gray-600">
                  {status === "success"
                    ? "การจองของคุณได้รับการยืนยันแล้ว"
                    : "กรุณาลองใหม่อีกครั้ง"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {status === "success" ? (
          <div className="space-y-6">
            {/* Success Animation */}
            <Card className="text-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-10"></div>
              <CardContent className="py-12 relative">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                    <PartyPopper className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  ชำระเงินสำเร็จ! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-6">{message}</p>
                <Badge
                  variant="success"
                  className="text-sm px-4 py-2 bg-green-100 text-green-800"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  การจองได้รับการยืนยันแล้ว
                </Badge>
              </CardContent>
            </Card>

            {/* Booking Details */}
            {booking && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">ข้อมูลการจอง</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          รหัสการจอง
                        </label>
                        <p className="text-lg font-semibold">#{booking.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          วันที่เช็คอิน
                        </label>
                        <p className="text-lg">
                          {formatDate(booking.checkIn, "th")}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          วันที่เช็คเอาท์
                        </label>
                        <p className="text-lg">
                          {formatDate(booking.checkOut, "th")}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          ยอดรวม
                        </label>
                        <p className="text-2xl font-bold text-green-600">
                          ฿{booking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          สถานะ
                        </label>
                        <div className="mt-1">
                          <Badge className="bg-green-100 text-green-800">
                            ยืนยันแล้ว
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleViewBookings}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                ดูการจองของฉัน
              </Button>
              <Button
                onClick={handleBackToHome}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                กลับหน้าหลัก
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  ขั้นตอนต่อไป
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• คุณจะได้รับอีเมลยืนยันการจองภายใน 5 นาที</li>
                  <li>• โปรดแสดงใบยืนยันการจองเมื่อเช็คอิน</li>
                  <li>• สามารถดาวน์โหลด PDF ใบยืนยันได้จากหน้าการจองของฉัน</li>
                  <li>• หากมีข้อสงสัยกรุณาติดต่อฝ่ายบริการลูกค้า</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="text-center">
            <CardContent className="py-12">
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                การชำระเงินไม่สำเร็จ
              </h1>
              <p className="text-lg text-gray-600 mb-8">{message}</p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Button
                  onClick={() => window.history.back()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  ลองใหม่อีกครั้ง
                </Button>
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="flex-1"
                >
                  กลับหน้าหลัก
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Complete;
