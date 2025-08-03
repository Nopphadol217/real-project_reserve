import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock, DollarSign } from "lucide-react";
import { listBookings } from "../../api/bookingAPI";
import useAuthStore from "@/store/useAuthStore";
import BookingPDF from "@/components/booking/BookingPDF";

const MyOrder = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) return;

        const response = await listBookings();
        console.log("Bookings response:", response);
        setBookings(response.result || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">ยืนยันแล้ว</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">รอการชำระ</Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">ยกเลิก</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            กรุณาเข้าสู่ระบบ
          </h2>
          <p className="text-gray-600">
            คุณต้องเข้าสู่ระบบเพื่อดูประวัติการจอง
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ประวัติการจองของฉัน
        </h1>
        <p className="text-gray-600">ดูและจัดการการจองทั้งหมดของคุณ</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ยังไม่มีการจอง
            </h3>
            <p className="text-gray-600 mb-6">
              คุณยังไม่มีประวัติการจองใดๆ เลย
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              เริ่มค้นหาที่พัก
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              รายการจอง ({bookings.length} รายการ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>รายการการจองทั้งหมดของคุณ</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">รหัสจอง</TableHead>
                  <TableHead>ที่พัก</TableHead>
                  <TableHead>ห้อง</TableHead>
                  <TableHead>วันที่เข้าพัก</TableHead>
                  <TableHead>วันที่ออก</TableHead>
                  <TableHead>จำนวนคืน</TableHead>
                  <TableHead>ราคารวม</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {booking.Place?.secure_url && (
                          <img
                            src={booking.Place.secure_url}
                            alt={booking.Place.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{booking.Place?.title}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            สถานที่พัก
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.Room ? (
                        <div>
                          <p className="font-medium">{booking.Room.name}</p>
                          <p className="text-sm text-gray-500">
                            ฿{booking.Room.price?.toLocaleString()}/คืน
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-500">ห้องมาตรฐาน</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        {formatDate(booking.checkIn)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        {formatDate(booking.checkOut)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {calculateNights(booking.checkIn, booking.checkOut)} คืน
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">
                          ฿{booking.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            console.log("View details:", booking.id)
                          }
                        >
                          ดูรายละเอียด
                        </Button>
                        {booking.status === "confirmed" && (
                          <BookingPDF booking={booking} />
                        )}
                        {booking.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              (window.location.href = `/user/checkout/${booking.id}`)
                            }
                          >
                            ชำระเงิน
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyOrder;
