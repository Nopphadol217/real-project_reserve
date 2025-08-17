import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  FileText,
  CheckCircle,
  Eye,
  Star,
  Receipt,
  CreditCard,
  QrCode,
  Building,
  Wallet,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { listBookings } from "@/api/bookingAPI";
import { getPaymentInfoAPI } from "@/api/paymentAPI";
import { formatDate } from "@/utils/formatDate";
import { pdf } from "@react-pdf/renderer";
import BookingPDF from "@/components/booking/BookingPDF";
import { toast } from "sonner";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await listBookings();
      if (response.success) {
        // Filter to show only paid/confirmed bookings
        const paidOrders = response.bookings.filter(
          (booking) =>
            booking.paymentStatus === "paid" ||
            booking.paymentStatus === "completed" ||
            booking.status === "confirmed"
        );
        setOrders(paidOrders);

        // Fetch payment info for each unique place
        const uniquePlaceIds = [
          ...new Set(paidOrders.map((order) => order.placeId)),
        ];
        const paymentInfoPromises = uniquePlaceIds.map(async (placeId) => {
          try {
            const paymentResponse = await getPaymentInfoAPI(placeId);
            return { placeId, data: paymentResponse.data.data };
          } catch (error) {
            console.log(`No payment info for place ${placeId}`);
            return { placeId, data: null };
          }
        });

        const paymentResults = await Promise.all(paymentInfoPromises);
        const paymentInfoMap = {};
        paymentResults.forEach(({ placeId, data }) => {
          paymentInfoMap[placeId] = data;
        });
        setPaymentInfo(paymentInfoMap);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("ไม่สามารถโหลดข้อมูลการจองได้");
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (paymentStatus === "paid" || status === "confirmed") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          ชำระเงินแล้ว
        </Badge>
      );
    }
    if (status === "completed") {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          เสร็จสิ้น
        </Badge>
      );
    }
    return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getPaymentMethodBadge = (order) => {
    // ตรวจสอบ paymentMethod ก่อน
    if (order.paymentMethod === "cash") {
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
    else if (order.paymentSlip || order.paymentMethod === "bank_transfer") {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-green-600"
        >
          <Building className="w-3 h-3" />
          โอนธนาคาร
        </Badge>
      );
    }
    // ถ้าไม่มี paymentSlip แต่มี paymentStatus = paid หรือ confirmed แสดงว่าชำระผ่าน Stripe
    else if (
      order.paymentMethod === "stripe" ||
      order.paymentStatus === "paid" ||
      order.paymentStatus === "confirmed"
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
    // ถ้าสถานะ unpaid
    else if (order.paymentStatus === "unpaid") {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-red-600"
        >
          <Clock className="w-3 h-3" />
          ยังไม่ชำระ
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              เกิดข้อผิดพลาด
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={fetchOrders}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ลองใหม่อีกครั้ง
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">การจองของฉัน</h1>
              <p className="text-gray-600 mt-1">
                ดูประวัติการจองที่ชำระเงินแล้วทั้งหมด
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                {orders.length} รายการ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ยังไม่มีการจองที่ชำระเงินแล้ว
              </h3>
              <p className="text-gray-600 mb-4">
                เมื่อคุณชำระเงินสำหรับการจองแล้ว จะแสดงที่นี่
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                เริ่มจองที่พัก
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">การจองที่ชำระแล้ว</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">คืนที่เข้าพักรวม</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.reduce(
                          (total, order) =>
                            total +
                            calculateNights(order.checkIn, order.checkOut),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CreditCard className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">ยอดรวมทั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ฿
                        {orders
                          .reduce(
                            (total, order) => total + (order.totalPrice || 0),
                            0
                          )
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
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
                        <TableHead>วิธีการชำระ</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {order.Place?.secure_url && (
                                <img
                                  src={order.Place.secure_url}
                                  alt={order.Place.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">
                                  {order.Place?.title || "ไม่ระบุ"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ห้อง: {order.Room?.name || "ไม่ระบุ"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(order.checkIn, "th")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(order.checkOut, "th")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {calculateNights(
                                order.checkIn,
                                order.checkOut
                              )}{" "}
                              คืน
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ฿{order.totalPrice?.toLocaleString() || "0"}
                          </TableCell>
                          <TableCell>{getPaymentMethodBadge(order)}</TableCell>
                          <TableCell>
                            {getStatusBadge(order.status, order.paymentStatus)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    ดู
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      รายละเอียดการจอง #{order.id}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedOrder && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">
                                            ที่พัก
                                          </label>
                                          <p className="text-lg font-semibold">
                                            {selectedOrder.Place?.title}
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">
                                            ห้อง
                                          </label>
                                          <p className="text-lg font-semibold">
                                            {selectedOrder.Room?.name}
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">
                                            วันที่เข้าพัก
                                          </label>
                                          <p className="text-lg">
                                            {formatDate(
                                              selectedOrder.checkIn,
                                              "th"
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">
                                            วันที่ออก
                                          </label>
                                          <p className="text-lg">
                                            {formatDate(
                                              selectedOrder.checkOut,
                                              "th"
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">
                                            จำนวนคืน
                                          </label>
                                          <p className="text-lg">
                                            {calculateNights(
                                              selectedOrder.checkIn,
                                              selectedOrder.checkOut
                                            )}{" "}
                                            คืน
                                          </p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">
                                            ยอดรวม
                                          </label>
                                          <p className="text-2xl font-bold text-green-600">
                                            ฿
                                            {selectedOrder.totalPrice?.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>

                                      {selectedOrder.Place?.secure_url && (
                                        <div>
                                          <label className="text-sm font-medium text-gray-500">
                                            รูปภาพที่พัก
                                          </label>
                                          <img
                                            src={selectedOrder.Place.secure_url}
                                            alt={selectedOrder.Place.title}
                                            className="w-full h-48 object-cover rounded-lg mt-2"
                                          />
                                        </div>
                                      )}

                                      <div className="border-t pt-4">
                                        <p className="text-sm text-gray-500 mb-2">
                                          วันที่จอง:{" "}
                                          {formatDate(
                                            selectedOrder.createdAt,
                                            "th"
                                          )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          อัปเดตล่าสุด:{" "}
                                          {formatDate(
                                            selectedOrder.updatedAt,
                                            "th"
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <BookingPDF booking={order} />
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

export default MyOrders;
