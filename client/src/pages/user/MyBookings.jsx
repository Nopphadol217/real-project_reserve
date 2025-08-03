import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  FileText,
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
import { listBookings } from "@/api/bookingAPI";
import { formatDate } from "@/utils/formatDate";
import { pdf } from "@react-pdf/renderer";
import BookingPDF from "@/components/booking/BookingPDF";

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
        setBookings(response.bookings);
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

  const downloadPDF = async (booking) => {
    try {
      const blob = await pdf(<BookingPDF booking={booking} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `booking-${booking.id}-invoice.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
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
              <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-gray-600">ที่จองไว้ทั้งหมด</p>
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
                ไม่มีการจองขณะนี้
              </h2>
              <p className="text-gray-600 mb-6">คุณยังไม่มีการจองที่พักใดๆ</p>
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
                        <TableHead>สถานะ</TableHead>
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadPDF(booking)}
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              PDF
                            </Button>
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
