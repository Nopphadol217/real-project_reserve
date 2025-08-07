import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  XCircle,
  MapPin,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getAllBookingsWithPaymentAPI } from "@/api/paymentAPI";
import useAuthStore from "@/store/useAuthStore";
import usePlaceStore from "@/store/usePlaceStore";

const BusinessBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const user = useAuthStore((state) => state.user);
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);

  useEffect(() => {
    actionListPlace(user?.id);
  }, [actionListPlace, user?.id]);

  useEffect(() => {
    if (places.length > 0) {
      fetchBookings();
    }
  }, [places]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookingsWithPaymentAPI();

      // Check if response has data array directly or nested under bookings
      const bookingsData = response.data.data || response.data.bookings || [];

      if (response.data.success && Array.isArray(bookingsData)) {
        // Only filter if places array exists and has data
        if (places && Array.isArray(places) && places.length > 0) {
          const userBookings = bookingsData.filter((booking) =>
            places.some(
              (place) =>
                place.id === booking.placeId && place.userId === user?.id
            )
          );
          setBookings(userBookings);
        } else {
          // If places not loaded yet, set empty array
          setBookings([]);
        }
      } else {
        console.error("Invalid response format:", response.data);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800">ยืนยันแล้ว</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">รอยืนยัน</Badge>
        );
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">ยกเลิก</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">เสร็จสิ้น</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
      case "confirmed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            ชำระแล้ว
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            รอตรวจสอบ
          </Badge>
        );
      case "unpaid":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ยังไม่ชำระ
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            ปฏิเสธ
          </Badge>
        );
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
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "-";

      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "-";
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDetailDialog(true);
  };

  // BookingTable component
  const BookingTable = ({ bookings: tableBookings }) => (
    <Card>
      <CardHeader>
        <CardTitle>รายการการจอง</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ผู้จอง</TableHead>
              <TableHead>ที่พัก</TableHead>
              <TableHead>วันที่เข้าพัก</TableHead>
              <TableHead>จำนวนเงิน</TableHead>
              <TableHead>สถานะการจอง</TableHead>
              <TableHead>สถานะการชำระ</TableHead>
              <TableHead>วันที่จอง</TableHead>
              <TableHead>การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {booking.User?.firstName} {booking.User?.lastName}
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
                      ห้อง: {booking.Room?.name || "ไม่ระบุ"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{formatDate(booking.checkInDate)}</p>
                    <p className="text-sm text-gray-500">
                      ถึง {formatDate(booking.checkOutDate)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-green-600">
                    {formatCurrency(
                      booking.totalPrice || booking.paymentAmount || 0
                    )}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(booking.bookingStatus)}</TableCell>
                <TableCell>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </TableCell>
                <TableCell>
                  {booking.createdAt ? formatDate(booking.createdAt) : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewBooking(booking)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {tableBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ไม่มีการจองในหมวดนี้
            </h3>
            <p className="text-gray-500">การจองจะแสดงที่นี่เมื่อมีข้อมูล</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลการจอง...</p>
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
            จัดการการจอง
          </h1>
          <p className="text-gray-600">
            ติดตามและจัดการการจองสำหรับที่พักของคุณ
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    ยืนยันแล้ว
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      bookings.filter((b) => b.bookingStatus === "confirmed")
                        .length
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
                      bookings.filter((b) => b.bookingStatus === "pending")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <DollarSign className="w-6 h-6 text-purple-600" />
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
                        .reduce((sum, b) => sum + (b.paymentAmount || 0), 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for filtering bookings */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="pending">รอยืนยัน</TabsTrigger>
            <TabsTrigger value="confirmed">ยืนยันแล้ว</TabsTrigger>
            <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <BookingTable bookings={bookings} />
          </TabsContent>

          <TabsContent value="pending">
            <BookingTable
              bookings={bookings.filter((b) => b.bookingStatus === "pending")}
            />
          </TabsContent>

          <TabsContent value="confirmed">
            <BookingTable
              bookings={bookings.filter((b) => b.bookingStatus === "confirmed")}
            />
          </TabsContent>

          <TabsContent value="completed">
            <BookingTable
              bookings={bookings.filter((b) => b.bookingStatus === "completed")}
            />
          </TabsContent>
        </Tabs>

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
                        {selectedBooking.User?.firstName}{" "}
                        {selectedBooking.User?.lastName}
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
                        {formatDate(selectedBooking.checkInDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">วันที่ออก</p>
                      <p className="font-medium">
                        {formatDate(selectedBooking.checkOutDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">จำนวนเงิน</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(selectedBooking.paymentAmount)}
                      </p>
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
      </div>
    </div>
  );
};

export default BusinessBookings;
