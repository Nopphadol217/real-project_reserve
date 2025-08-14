import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  Edit,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Check,
  X,
  CreditCard,
  AlertCircle,
  Building2,
  XCircle,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllBookingsWithPaymentAPI,
  getPendingPaymentsAPI,
  confirmPaymentAPI,
  rejectPaymentAPI,
} from "@/api/paymentAPI";
import useAuthStore from "@/store/useAuthStore";
import usePlaceStore from "@/store/usePlaceStore";

const BusinessPaymentManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSlipDialog, setShowSlipDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const user = useAuthStore((state) => state.user);
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);

  useEffect(() => {
    actionListPlace();
  }, [actionListPlace]);

  useEffect(() => {
    if (places.length > 0) {
      fetchBookings();
    }
  }, [places]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // ดึงทั้ง paid bookings และ pending bookings
      const [paidResponse, pendingResponse] = await Promise.all([
        getAllBookingsWithPaymentAPI(),
        getPendingPaymentsAPI(),
      ]);

      console.log("Paid bookings response:", paidResponse.data);
      console.log("Pending bookings response:", pendingResponse.data);

      // รวมข้อมูลจากทั้งสอง API
      const paidBookingsData =
        paidResponse.data.data || paidResponse.data.bookings || [];
      const pendingBookingsData =
        pendingResponse.data.data || pendingResponse.data.bookings || [];

      // รวมข้อมูลและกรองข้อมูลซ้ำโดยใช้ id
      const allBookingsData = [...paidBookingsData, ...pendingBookingsData];
      const uniqueBookings = allBookingsData.filter(
        (booking, index, self) =>
          index === self.findIndex((b) => b.id === booking.id)
      );

      if (Array.isArray(uniqueBookings)) {
        // Only filter if places array exists and has data
        if (places && Array.isArray(places) && places.length > 0) {
          const userBookings = uniqueBookings.filter((booking) =>
            places.some(
              (place) =>
                place.id === booking.placeId && place.userId === user?.id
            )
          );
          setBookings(userBookings);
        } else {
          setBookings([]);
        }
      } else {
        console.error("Invalid response format");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (bookingId) => {
    try {
      await confirmPaymentAPI(bookingId);
      toast.success("อนุมัติการชำระเงินสำเร็จ");
      fetchBookings(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("เกิดข้อผิดพลาดในการอนุมัติการชำระเงิน");
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedBooking) return;

    try {
      await rejectPaymentAPI(selectedBooking.id, rejectReason);
      toast.success("ปฏิเสธการชำระเงินสำเร็จ");
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedBooking(null);
      fetchBookings(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("เกิดข้อผิดพลาดในการปฏิเสธการชำระเงิน");
    }
  };

  const getPaymentMethodBadge = (booking) => {
    // ตรวจสอบ paymentMethod ก่อน
    if (booking.paymentMethod === "cash") {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-orange-600"
        >
          <Wallet className="w-3 h-3" />
          เงินสด
        </Badge>
      );
    }
    // ถ้ามี paymentSlip แสดงว่าชำระผ่าน Bank Transfer
    else if (booking.paymentSlip || booking.paymentMethod === "bank_transfer") {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-green-600"
        >
          <Building2 className="w-3 h-3" />
          โอนธนาคาร
        </Badge>
      );
    }
    // ถ้าไม่มี paymentSlip แต่มี paymentStatus = paid หรือ confirmed แสดงว่าชำระผ่าน Stripe
    else if (
      booking.paymentMethod === "stripe" ||
      booking.paymentStatus === "paid" ||
      booking.paymentStatus === "confirmed"
    ) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-blue-600"
        >
          <CreditCard className="w-3 h-3" />
          Stripe
        </Badge>
      );
    }
    // ถ้าสถานะ pending และไม่มี slip แสดงว่าเป็น Stripe ที่ยังไม่ได้ชำระ
    else if (booking.paymentStatus === "pending") {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-orange-600"
        >
          <Clock className="w-3 h-3" />
          รอชำระ
        </Badge>
      );
    }
    return null;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return <Badge className="bg-green-100 text-green-800">ชำระแล้ว</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">รอยืนยัน</Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">ยกเลิก</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            จัดการการชำระเงิน
          </h1>
          <p className="text-gray-600">
            ติดตามและจัดการสถานะการชำระเงินสำหรับที่พักของคุณ
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ชำระแล้ว</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      bookings.filter(
                        (b) =>
                          b.paymentStatus === "confirmed" ||
                          b.paymentStatus === "paid"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">รอยืนยัน</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      bookings.filter(
                        (b) =>
                          b.paymentStatus === "pending" ||
                          b.paymentStatus === "cash"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">รายได้รวม</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      bookings
                        .filter(
                          (b) =>
                            b.paymentStatus === "confirmed" ||
                            b.paymentStatus === "paid"
                        )
                        .reduce(
                          (sum, b) =>
                            sum + (b.totalPrice || b.paymentAmount || 0),
                          0
                        )
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    การจองทั้งหมด
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการการชำระเงิน</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้จอง</TableHead>
                  <TableHead>ที่พัก</TableHead>
                  <TableHead>วันที่เข้าพัก</TableHead>
                  <TableHead>วันที่ออก</TableHead>
                  <TableHead>จำนวนเงิน</TableHead>
                  <TableHead>วิธีการชำระ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่ชำระ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {booking.User?.firstname} {booking.User?.lastname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.User?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.Place?.title}</p>
                        <p className="text-sm text-gray-500">
                          ห้อง: {booking.Room?.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>{formatDate(booking.checkIn)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.checkOut)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-600">
                        {formatCurrency(
                          booking.totalPrice || booking.paymentAmount || 0
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{getPaymentMethodBadge(booking)}</TableCell>
                    <TableCell>
                      {getStatusBadge(booking.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      {booking.updatedAt ? formatDate(booking.updatedAt) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.paymentSlip && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowSlipDialog(true);
                            }}
                          >
                            สลิป
                          </Button>
                        )}
                        {booking.paymentStatus === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPayment(booking.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              อนุมัติ
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowRejectDialog(true);
                              }}
                            >
                              <X className="w-4 h-4 mr-1" />
                              ปฏิเสธ
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {bookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ยังไม่มีการจอง
                </h3>
                <p className="text-gray-500">
                  เมื่อมีผู้จองที่พักของคุณ รายการจะแสดงที่นี่
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Details Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>รายละเอียดการจอง</DialogTitle>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                {/* Guest Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">ข้อมูลผู้จอง</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ชื่อ-นามสกุล</p>
                      <p className="font-medium">
                        {selectedBooking.User?.firstname}{" "}
                        {selectedBooking.User?.lastname}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">อีเมล</p>
                      <p className="font-medium">
                        {selectedBooking.User?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">ข้อมูลการจอง</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ที่พัก</p>
                      <p className="font-medium">
                        {selectedBooking.Place?.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ห้อง</p>
                      <p className="font-medium">
                        {selectedBooking.Room?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">วันที่เข้าพัก</p>
                      <p className="font-medium">
                        {formatDate(selectedBooking.checkIn)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">วันที่ออก</p>
                      <p className="font-medium">
                        {formatDate(selectedBooking.checkOut)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">จำนวนเงิน</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(
                          selectedBooking.totalPrice ||
                            selectedBooking.paymentAmount
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">วิธีการชำระ</p>
                      <div className="mt-1">
                        {getPaymentMethodBadge(selectedBooking)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">สถานะ</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedBooking.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Slip Dialog */}
        <Dialog open={showSlipDialog} onOpenChange={setShowSlipDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>สลิปการโอนเงิน</DialogTitle>
            </DialogHeader>

            {selectedBooking?.paymentSlip && (
              <div className="space-y-4">
                <img
                  src={selectedBooking.paymentSlip}
                  alt="Payment Slip"
                  className="w-full h-auto rounded-lg border"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => handleConfirmPayment(selectedBooking.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    อนุมัติ
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowSlipDialog(false);
                      setShowRejectDialog(true);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    ปฏิเสธ
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Payment Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ปฏิเสธการชำระเงิน</DialogTitle>
              <DialogDescription>
                กรุณาระบุเหตุผลในการปฏิเสธการชำระเงิน
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Textarea
                placeholder="เหตุผลในการปฏิเสธ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason("");
                }}
              >
                ยกเลิก
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectPayment}
                disabled={!rejectReason.trim()}
              >
                ปฏิเสธการชำระเงิน
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BusinessPaymentManagement;
