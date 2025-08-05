import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  MapPin,
  User,
  CreditCard,
  AlertCircle,
  Building2,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { getAllBookingsWithPaymentAPI } from "@/api/paymentAPI";

const BookingManagement = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookingsWithPaymentAPI();
      console.log("BookingManagement - API Response:", response);
      console.log("BookingManagement - Data:", response.data);

      if (response.data && response.data.success) {
        // ข้อมูลอยู่ใน response.data.bookings ไม่ใช่ response.data.data
        const bookingsData = response.data.bookings || response.data.data || [];
        setAllBookings(bookingsData);
        console.log("BookingManagement - Bookings set:", bookingsData);
      } else {
        console.error(
          "BookingManagement - Invalid response structure:",
          response.data
        );
        setAllBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      unpaid: { label: "ยังไม่ชำระ", variant: "secondary", icon: Clock },
      pending: { label: "รอตรวจสอบ", variant: "warning", icon: AlertCircle },
      paid: { label: "ชำระแล้ว", variant: "success", icon: CheckCircle },
      confirmed: { label: "ชำระแล้ว", variant: "success", icon: CheckCircle },
      rejected: { label: "ปฏิเสธ", variant: "destructive", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.unpaid;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (booking) => {
    if (booking.paymentSlip) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          โอนธนาคาร
        </Badge>
      );
    } else if (
      booking.paymentStatus === "paid" ||
      booking.status === "confirmed"
    ) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          Stripe
        </Badge>
      );
    } else if (booking.paymentStatus === "unpaid") {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          ยังไม่ชำระ
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        ไม่ระบุ
      </Badge>
    );
  };

  const getBookingStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "รอยืนยัน", variant: "warning", icon: Clock },
      confirmed: { label: "ยืนยันแล้ว", variant: "success", icon: CheckCircle },
      cancelled: { label: "ยกเลิก", variant: "destructive", icon: XCircle },
      completed: { label: "เสร็จสิ้น", variant: "default", icon: CheckCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // คำนวณสถิติ
  const totalRevenue = allBookings
    .filter(
      (b) => b.paymentStatus === "paid" || b.paymentStatus === "confirmed"
    )
    .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

  const totalBookings = allBookings.length;
  const confirmedBookings = allBookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const pendingBookings = allBookings.filter(
    (b) => b.status === "pending"
  ).length;

  const filterBookingsByTab = (tab) => {
    switch (tab) {
      case "confirmed":
        return allBookings.filter((b) => b.status === "confirmed");
      case "pending":
        return allBookings.filter((b) => b.status === "pending");
      case "cancelled":
        return allBookings.filter((b) => b.status === "cancelled");
      default:
        return allBookings;
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
            จัดการการจองทั้งหมด
          </h1>
          <p className="text-gray-600 mt-1">
            ตรวจสอบและจัดการการจองทั้งหมดในระบบ
          </p>
        </div>
        <Button onClick={fetchBookings} variant="outline">
          รีเฟรชข้อมูล
        </Button>
      </div>

      {/* สถิติการจอง */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">การจองทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalBookings}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ยืนยันแล้ว</p>
                <p className="text-2xl font-bold text-green-600">
                  {confirmedBookings}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รอยืนยัน</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingBookings}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รายได้รวม</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            ทั้งหมด ({totalBookings})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            ยืนยันแล้ว ({confirmedBookings})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            รอยืนยัน ({pendingBookings})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            ยกเลิก ({allBookings.filter((b) => b.status === "cancelled").length}
            )
          </TabsTrigger>
        </TabsList>

        {["all", "confirmed", "pending", "cancelled"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  การจอง
                  {tab === "all" && "ทั้งหมด"}
                  {tab === "confirmed" && "ที่ยืนยันแล้ว"}
                  {tab === "pending" && "ที่รอยืนยัน"}
                  {tab === "cancelled" && "ที่ยกเลิก"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัส</TableHead>
                      <TableHead>ที่พัก</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead>วันที่เข้าพัก</TableHead>
                      <TableHead>วันที่ออก</TableHead>
                      <TableHead>คืน</TableHead>
                      <TableHead>ยอดเงิน</TableHead>
                      <TableHead>สถานะการชำระ</TableHead>
                      <TableHead>วิธีชำระ</TableHead>
                      <TableHead>สถานะการจอง</TableHead>
                      <TableHead>วันที่จอง</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterBookingsByTab(tab).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <p className="font-medium">#{booking.id}</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {booking.Place?.title || "ไม่ระบุ"}
                            </p>
                            <p className="text-sm text-gray-600">
                              ห้อง: {booking.Room?.name || "ไม่ระบุ"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {booking.User?.firstname} {booking.User?.lastname}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.User?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {formatDateOnly(booking.checkIn)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {formatDateOnly(booking.checkOut)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {calculateNights(booking.checkIn, booking.checkOut)}{" "}
                            คืน
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-green-600">
                            {formatCurrency(booking.totalPrice)}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </TableCell>
                        <TableCell>{getPaymentMethodBadge(booking)}</TableCell>
                        <TableCell>
                          {getBookingStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {formatDate(booking.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            ดูรายละเอียด
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog สำหรับดูรายละเอียด */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดการจอง #{selectedBooking?.id}</DialogTitle>
            <DialogDescription>ข้อมูลเต็มของการจอง</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    ข้อมูลที่พัก
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedBooking.Place?.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    ห้อง: {selectedBooking.Room?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ราคา: {formatCurrency(selectedBooking.Room?.price || 0)}/คืน
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    วันที่เข้าพัก
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    เข้าพัก: {formatDateOnly(selectedBooking.checkIn)}
                  </p>
                  <p className="text-sm text-gray-600">
                    ออก: {formatDateOnly(selectedBooking.checkOut)}
                  </p>
                  <p className="text-sm text-gray-600">
                    จำนวนคืน:{" "}
                    {calculateNights(
                      selectedBooking.checkIn,
                      selectedBooking.checkOut
                    )}{" "}
                    คืน
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ข้อมูลลูกค้า
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedBooking.User?.firstname}{" "}
                    {selectedBooking.User?.lastname}
                  </p>
                  <p className="text-sm text-gray-600">
                    อีเมล: {selectedBooking.User?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    ผู้เข้าพัก: {selectedBooking.guests} คน
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    ข้อมูลการชำระเงิน
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    ยอดรวม: {formatCurrency(selectedBooking.totalPrice)}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                    {getPaymentMethodBadge(selectedBooking)}
                  </div>
                  <div className="mt-1">
                    {getBookingStatusBadge(selectedBooking.status)}
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500">
                  วันที่จอง: {formatDate(selectedBooking.createdAt)}
                </p>
                {selectedBooking.updatedAt !== selectedBooking.createdAt && (
                  <p className="text-sm text-gray-500">
                    อัปเดตล่าสุด: {formatDate(selectedBooking.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
