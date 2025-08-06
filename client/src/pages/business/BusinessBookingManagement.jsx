import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";
import { getAllBookingsWithPaymentAPI } from "@/api/paymentAPI";
import useAuthStore from "@/store/useAuthStore";
import usePlaceStore from "@/store/usePlaceStore";

const BusinessBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get current user and places
  const user = useAuthStore((state) => state.user);
  const places = usePlaceStore((state) => state.places);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookingsWithPaymentAPI();
      if (response.data.success) {
        // Filter bookings for places owned by current user
        const userBookings = response.data.bookings.filter((booking) => {
          const place = places.find((p) => p.id === booking.placeId);
          return place && place.userId === user.id;
        });
        setBookings(userBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.User?.firstname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.User?.lastname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.User?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.Place?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.paymentStatus === statusFilter
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "รอการชำระ", variant: "secondary", icon: Clock },
      confirmed: { label: "ยืนยันแล้ว", variant: "default", icon: CheckCircle },
      paid: { label: "ชำระแล้ว", variant: "default", icon: CheckCircle },
      cancelled: { label: "ยกเลิก", variant: "destructive", icon: XCircle },
    };

    const config = statusMap[status] || {
      label: status,
      variant: "secondary",
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลการจอง...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการการจอง</h1>
          <p className="text-gray-600">ติดตามและจัดการการจองในที่พักของคุณ</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600">
            การจองทั้งหมด: {filteredBookings.length}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาด้วยชื่อผู้จอง, อีเมล หรือชื่อที่พัก..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอการชำระ</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="paid">ชำระแล้ว</option>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสการจอง</TableHead>
                  <TableHead>ผู้จอง</TableHead>
                  <TableHead>ที่พัก</TableHead>
                  <TableHead>ห้อง</TableHead>
                  <TableHead>วันที่เข้าพัก</TableHead>
                  <TableHead>วันที่ออก</TableHead>
                  <TableHead>ยอดรวม</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      #{booking.id.slice(-6)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {booking.User?.firstname} {booking.User?.lastname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.User?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {booking.Place?.title || "ไม่ระบุ"}
                      </div>
                    </TableCell>
                    <TableCell>
                      ห้อง: {booking.Room?.name || "ไม่ระบุ"}
                    </TableCell>
                    <TableCell>{formatDate(booking.checkIn)}</TableCell>
                    <TableCell>{formatDate(booking.checkOut)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(booking.paymentAmount || 0)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            ดูรายละเอียด
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              รายละเอียดการจอง #{selectedBooking?.id.slice(-6)}
                            </DialogTitle>
                            <DialogDescription>
                              ข้อมูลการจองและการชำระเงิน
                            </DialogDescription>
                          </DialogHeader>

                          {selectedBooking && (
                            <div className="space-y-6">
                              {/* Guest Information */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  ข้อมูลผู้จอง
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">ชื่อ:</span>
                                    <p className="font-medium">
                                      {selectedBooking.User?.firstname}{" "}
                                      {selectedBooking.User?.lastname}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      อีเมล:
                                    </span>
                                    <p>{selectedBooking.User?.email}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      เบอร์โทร:
                                    </span>
                                    <p>
                                      {selectedBooking.User?.phone || "ไม่ระบุ"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Booking Information */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  ข้อมูลการจอง
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">
                                      ที่พัก:
                                    </span>
                                    <p className="font-medium">
                                      {selectedBooking.Place?.title}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">ห้อง:</span>
                                    <p>{selectedBooking.Room?.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      วันที่เข้าพัก:
                                    </span>
                                    <p>{formatDate(selectedBooking.checkIn)}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      วันที่ออก:
                                    </span>
                                    <p>
                                      {formatDate(selectedBooking.checkOut)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Information */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  ข้อมูลการชำระเงิน
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">
                                      ยอดรวม:
                                    </span>
                                    <p className="font-bold text-lg">
                                      {formatCurrency(
                                        selectedBooking.paymentAmount || 0
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      สถานะ:
                                    </span>
                                    <div className="mt-1">
                                      {getStatusBadge(
                                        selectedBooking.paymentStatus
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      วิธีการชำระ:
                                    </span>
                                    <p>
                                      {selectedBooking.paymentMethod ||
                                        "ไม่ระบุ"}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      วันที่จอง:
                                    </span>
                                    <p>
                                      {formatDate(selectedBooking.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ไม่พบข้อมูลการจอง</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessBookingManagement;
