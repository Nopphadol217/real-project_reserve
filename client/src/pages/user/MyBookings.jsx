import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  FileText,
  CreditCard,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listBookings, checkout, cancelBooking } from "@/api/bookingAPI";
import { formatDate } from "@/utils/formatDate";
import { pdf } from "@react-pdf/renderer";
import BookingPDF from "@/components/booking/BookingPDF";
import { toast } from "sonner";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await listBookings();
      if (response.success) {
        // Filter to show only pending bookings (unpaid)
        const pendingBookings = response.bookings.filter(
          (booking) =>
            booking.paymentStatus === "pending" ||
            booking.paymentStatus === "unpaid"
        );
        setBookings(pendingBookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("ไม่สามารถโหลดข้อมูลการจองได้");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "รอการยืนยัน", variant: "secondary" },
      confirmed: { label: "ยืนยันแล้ว", variant: "success" },
      cancelled: { label: "ยกเลิกแล้ว", variant: "destructive" },
      completed: { label: "เสร็จสิ้น", variant: "default" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const statusConfig = {
      pending: { label: "รอการชำระ", variant: "destructive" },
      confirmed: { label: "ชำระแล้ว", variant: "success" },
      failed: { label: "ชำระไม่สำเร็จ", variant: "destructive" },
    };

    const config = statusConfig[paymentStatus] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (booking) => {
    // ถ้ามี paymentSlip แสดงว่าเป็นการชำระผ่านธนาคาร
    if (booking.paymentSlip) {
      return (
        <Badge variant="outline" className="font-medium">
          ธนาคาร
        </Badge>
      );
    }
    // ถ้าไม่มี paymentSlip แต่ status เป็น paid แสดงว่าเป็น Stripe
    else if (booking.status === "confirmed") {
      return (
        <Badge variant="outline" className="font-medium text-blue-600">
          Stripe
        </Badge>
      );
    }
    // ถ้าไม่มี paymentSlip และ status เป็น pending อาจเป็น Stripe ที่ยังไม่ได้ชำระ
    else if (booking.status === "pending") {
      return (
        <Badge variant="outline" className="font-medium text-orange-600">
          Stripe (รอชำระ)
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="font-medium">
        -
      </Badge>
    );
  };

  const handleContinuePayment = async (booking) => {
    try {
      toast.loading("กำลังเตรียมหน้าชำระเงิน...");
      const response = await checkout(booking.id);
      toast.dismiss();

      if (response.success && response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        console.error("Failed to create checkout session:", response);
        toast.error("ไม่สามารถเตรียมหน้าชำระเงินได้");
        // Fallback: redirect to checkout page
        window.location.href = `/user/checkout/${booking.id}`;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.dismiss();
      toast.error("เกิดข้อผิดพลาดในการเตรียมหน้าชำระเงิน");
      // Fallback: redirect to checkout page
      window.location.href = `/user/checkout/${booking.id}`;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      toast.loading("กำลังยกเลิกการจอง...");
      const response = await cancelBooking(bookingId);
      toast.dismiss();

      if (response.data.success) {
        toast.success("ยกเลิกการจองสำเร็จ");
        fetchBookings(); // Refresh the list
      } else {
        toast.error("ไม่สามารถยกเลิกการจองได้");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.dismiss();
      toast.error("เกิดข้อผิดพลาดในการยกเลิกการจอง");
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลการจอง...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchBookings}>ลองใหม่อีกครั้ง</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                การจองที่รอชำระเงิน
              </h1>
              <p className="text-gray-600">รายการจองที่ยังไม่ได้ชำระเงิน</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                ไม่มีการจองที่รอชำระเงิน
              </h2>
              <p className="text-gray-600 mb-6">
                คุณไม่มีการจองที่รอการชำระเงิน
              </p>
              <Button onClick={() => (window.location.href = "/")}>
                เริ่มค้นหาที่พัก
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">การจองทั้งหมด</p>
                      <p className="text-2xl font-bold">{bookings.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">ยืนยันแล้ว</p>
                      <p className="text-2xl font-bold">
                        {
                          bookings.filter((b) => b.status === "confirmed")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">รอยืนยัน</p>
                      <p className="text-2xl font-bold">
                        {bookings.filter((b) => b.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">ยอดรวม</p>
                      <p className="text-2xl font-bold">
                        ฿
                        {bookings
                          .reduce((sum, b) => sum + b.totalPrice, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  รายการการจอง
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัสการจอง</TableHead>
                        <TableHead>ที่พัก</TableHead>
                        <TableHead>วันที่เข้าพัก</TableHead>
                        <TableHead>วันที่ออก</TableHead>
                        <TableHead>จำนวนคืน</TableHead>
                        <TableHead>ยอดรวม</TableHead>
                        <TableHead>สถานะการจอง</TableHead>
                        <TableHead>สถานะการชำระ</TableHead>
                        <TableHead>วิธีการชำระ</TableHead>
                        <TableHead>การดำเนินการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            #{booking.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {booking.Place?.secure_url && (
                                <img
                                  src={booking.Place.secure_url}
                                  alt={booking.Place.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">
                                  {booking.Place?.title}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {booking.Room?.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(booking.checkIn, "th")}
                          </TableCell>
                          <TableCell>
                            {formatDate(booking.checkOut, "th")}
                          </TableCell>
                          <TableCell>
                            {calculateNights(booking.checkIn, booking.checkOut)}{" "}
                            คืน
                          </TableCell>
                          <TableCell className="font-semibold">
                            ฿{booking.totalPrice?.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodBadge(booking)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <BookingPDF booking={booking} />
                              {booking.status === "pending" &&
                                !booking.paymentSlip && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                      handleContinuePayment(booking)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    ชำระเงิน
                                  </Button>
                                )}
                              {(booking.paymentStatus === "pending" ||
                                booking.paymentStatus === "unpaid") && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  ยกเลิก
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
