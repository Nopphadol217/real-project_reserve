import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Upload,
  CheckCircle,
} from "lucide-react";
import { listPendingPayments } from "@/api/bookingAPI";
import useUserStore from "@/store/useUserStore";

import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import PaymentMethodSelector from "@/components/booking/PaymentMethodSelector";
import useAuthStore from "@/store/useAuthStore";

const PendingPayment = () => {
  const user = useAuthStore((state) => state.user);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPendingPayments(user.id);
    }
    console.log("User ID:", user?.id);
  }, [user?.id]);

  const fetchPendingPayments = async () => {
    try {
      setIsLoading(true);
      const response = await listPendingPayments(user.id);
      console.log("Pending Payments Response:", response);
      if (response.success) {
        setPendingBookings(response.bookings);
      }
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  const formatDate = (date) => {
    return format(new Date(date), "d MMM yyyy", { locale: th });
  };

  const formatTime = (date) => {
    return format(new Date(date), "HH:mm", { locale: th });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          รายการรอชำระเงิน
        </h1>
        <p className="text-gray-600">กรุณาชำระเงินเพื่อยืนยันการจองของคุณ</p>
      </div>

      {/* Pending Bookings List */}
      {pendingBookings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่มีรายการรอชำระเงิน
            </h3>
            <p className="text-gray-600 mb-4">คุณไม่มีการจองที่รอการชำระเงิน</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-orange-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {booking.Place.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      รหัสการจอง: #{booking.id}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 border-orange-300"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    รอชำระเงิน
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Place Image */}
                  <div className="md:col-span-1">
                    <img
                      src={booking.Place.secure_url}
                      alt={booking.Place.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Check-in/out */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          วันที่เข้าพัก
                        </div>
                        <p className="font-medium">
                          {formatDate(booking.checkIn)} •{" "}
                          {formatTime(booking.checkIn)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          วันที่ออก
                        </div>
                        <p className="font-medium">
                          {formatDate(booking.checkOut)} •{" "}
                          {formatTime(booking.checkOut)}
                        </p>
                      </div>

                      {/* Room */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          ห้องพัก
                        </div>
                        <p className="font-medium">
                          {booking.Room?.name || "ห้องมาตรฐาน"}
                        </p>
                      </div>

                      {/* Nights */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          จำนวนคืน
                        </div>
                        <p className="font-medium">
                          {calculateNights(booking.checkIn, booking.checkOut)}{" "}
                          คืน
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Price & Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">ราคารวม</p>
                        <p className="text-2xl font-bold text-red-600">
                          ฿{booking.totalPrice?.toLocaleString()}
                        </p>
                      </div>

                      <Button
                        onClick={() => handlePayNow(booking)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        ชำระเงินตอนนี้
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <PaymentMethodSelector
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBooking(null);
          }}
          bookingData={{
            placeId: selectedBooking.placeId,
            checkIn: selectedBooking.checkIn,
            checkOut: selectedBooking.checkOut,
            totalPrice: selectedBooking.totalPrice,
            price: selectedBooking.Room?.price || 0,
            nights: calculateNights(
              selectedBooking.checkIn,
              selectedBooking.checkOut
            ),
            placeTitle: selectedBooking.Place.title,
            roomId: selectedBooking.roomId,
            roomName: selectedBooking.Room?.name || "ห้องมาตรฐาน",
            bookingId: selectedBooking.id, // ส่ง bookingId ที่มีอยู่แล้ว
          }}
          onPaymentComplete={() => {
            setShowPaymentModal(false);
            setSelectedBooking(null);
            fetchPendingPayments(); // Refresh list
            toast.success("ชำระเงินเรียบร้อยแล้ว");
          }}
        />
      )}
    </div>
  );
};

export default PendingPayment;
