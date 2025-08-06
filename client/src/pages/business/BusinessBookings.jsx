import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

const BusinessBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Simulated bookings data
  const [bookings, setBookings] = useState([
    {
      id: "BK001",
      guestName: "คุณสมชาย ใจดี",
      guestEmail: "somchai@email.com",
      guestPhone: "089-123-4567",
      placeName: "Villa Sunset View",
      placeId: "P001",
      checkIn: "2024-02-15",
      checkOut: "2024-02-17",
      guests: 4,
      nights: 2,
      pricePerNight: 2250,
      totalPrice: 4500,
      status: "confirmed",
      paymentStatus: "paid",
      bookedAt: "2024-02-10T10:30:00Z",
      specialRequests: "ต้องการห้องติดกัน",
    },
    {
      id: "BK002",
      guestName: "คุณมาลี สวยงาม",
      guestEmail: "malee@email.com",
      guestPhone: "087-987-6543",
      placeName: "Beach House Deluxe",
      placeId: "P002",
      checkIn: "2024-02-18",
      checkOut: "2024-02-20",
      guests: 2,
      nights: 2,
      pricePerNight: 3400,
      totalPrice: 6800,
      status: "pending",
      paymentStatus: "pending",
      bookedAt: "2024-02-12T14:15:00Z",
      specialRequests: "",
    },
    {
      id: "BK003",
      guestName: "คุณประยุทธ ทองคำ",
      guestEmail: "prayuth@email.com",
      guestPhone: "081-555-7777",
      placeName: "Mountain Resort",
      placeId: "P003",
      checkIn: "2024-02-20",
      checkOut: "2024-02-22",
      guests: 6,
      nights: 2,
      pricePerNight: 1600,
      totalPrice: 3200,
      status: "confirmed",
      paymentStatus: "paid",
      bookedAt: "2024-02-14T09:20:00Z",
      specialRequests: "ต้องการจัดเตรียมอาหารเด็ก",
    },
    {
      id: "BK004",
      guestName: "คุณวิไล ดีใจ",
      guestEmail: "wilai@email.com",
      guestPhone: "082-888-9999",
      placeName: "Villa Sunset View",
      placeId: "P001",
      checkIn: "2024-02-25",
      checkOut: "2024-02-28",
      guests: 8,
      nights: 3,
      pricePerNight: 2250,
      totalPrice: 6750,
      status: "cancelled",
      paymentStatus: "refunded",
      bookedAt: "2024-02-13T16:45:00Z",
      specialRequests: "",
    },
  ]);

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.placeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConfirmBooking = async (bookingId) => {
    try {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "confirmed" }
            : booking
        )
      );
      toast.success("ยืนยันการจองสำเร็จ");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการยืนยันการจอง");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
      toast.success("ยกเลิกการจองสำเร็จ");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการยกเลิกการจอง");
    }
  };

  const openDetailDialog = (booking) => {
    setSelectedBooking(booking);
    setShowDetailDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "ยืนยันแล้ว";
      case "pending":
        return "รอยืนยัน";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "ชำระแล้ว";
      case "pending":
        return "รอชำระ";
      case "refunded":
        return "คืนเงินแล้ว";
      default:
        return status;
    }
  };

  // Stats for summary cards
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">จัดการการจอง</h1>
            <p className="text-gray-600 mt-1">
              จัดการและติดตามการจองที่พักของคุณ
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">การจองทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.total}
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
                    {stats.confirmed}
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
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ยกเลิก</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.cancelled}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ค้นหาด้วยชื่อลูกค้า, ที่พัก, หรือรหัสการจอง..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="pending">รอยืนยัน</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              รายการการจอง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสการจอง</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>ที่พัก</TableHead>
                  <TableHead>วันที่เข้าพัก</TableHead>
                  <TableHead>จำนวนคืน</TableHead>
                  <TableHead>ราคารวม</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>การชำระเงิน</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-sm text-gray-500">
                            {booking.guests} ท่าน
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.placeName}</TableCell>
                      <TableCell>
                        <div>
                          <p>
                            {new Date(booking.checkIn).toLocaleDateString(
                              "th-TH"
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            ถึง{" "}
                            {new Date(booking.checkOut).toLocaleDateString(
                              "th-TH"
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.nights} คืน</TableCell>
                      <TableCell className="font-bold text-green-600">
                        ฿{booking.totalPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getPaymentStatusColor(
                            booking.paymentStatus
                          )}
                        >
                          {getPaymentStatusText(booking.paymentStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetailDialog(booking)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            ดู
                          </Button>
                          {booking.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleConfirmBooking(booking.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                ยืนยัน
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                ยกเลิก
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {searchTerm
                        ? "ไม่พบการจองที่ตรงกับการค้นหา"
                        : "ไม่มีข้อมูลการจอง"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Booking Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                รายละเอียดการจอง {selectedBooking?.id}
              </DialogTitle>
              <DialogDescription>
                ข้อมูลการจองและรายละเอียดลูกค้า
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                {/* Guest Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ข้อมูลลูกค้า
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ชื่อ:</span>
                      <span className="ml-2 font-medium">
                        {selectedBooking.guestName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">จำนวนผู้เข้าพัก:</span>
                      <span className="ml-2 font-medium">
                        {selectedBooking.guests} ท่าน
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="ml-1">{selectedBooking.guestEmail}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="ml-1">{selectedBooking.guestPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    ข้อมูลการจอง
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">ที่พัก:</span>
                      <span className="ml-2 font-medium">
                        {selectedBooking.placeName}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">จำนวนคืน:</span>
                      <span className="ml-2 font-medium">
                        {selectedBooking.nights} คืน
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">เช็คอิน:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedBooking.checkIn).toLocaleDateString(
                          "th-TH"
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">เช็คเอาต์:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedBooking.checkOut).toLocaleDateString(
                          "th-TH"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    ข้อมูลการชำระเงิน
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">ราคาต่อคืน:</span>
                      <span className="ml-2 font-medium">
                        ฿{selectedBooking.pricePerNight.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600">ราคารวม:</span>
                      <span className="ml-2 font-bold text-lg">
                        ฿{selectedBooking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600">สถานะการจอง:</span>
                      <Badge
                        className={`ml-2 ${getStatusColor(
                          selectedBooking.status
                        )}`}
                      >
                        {getStatusText(selectedBooking.status)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-green-600">สถานะการชำระ:</span>
                      <Badge
                        className={`ml-2 ${getPaymentStatusColor(
                          selectedBooking.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusText(selectedBooking.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      คำขอพิเศษ
                    </h4>
                    <p className="text-sm text-yellow-800">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Booking Date */}
                <div className="text-center text-sm text-gray-500">
                  จองเมื่อ:{" "}
                  {new Date(selectedBooking.bookedAt).toLocaleString("th-TH")}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BusinessBookings;
