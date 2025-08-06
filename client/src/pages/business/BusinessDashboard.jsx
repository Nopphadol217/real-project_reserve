import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  MapPin,
  Star,
  Clock,
  Edit,
  Home,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Activity,
} from "lucide-react";
import { Link } from "react-router";
import useAuthStore from "@/store/useAuthStore";
import usePlaceStore from "@/store/usePlaceStore";
import { getAllBookingsWithPaymentAPI } from "@/api/paymentAPI";

const BusinessDashboard = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user
  const user = useAuthStore((state) => state.user);
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);

  useEffect(() => {
    actionListPlace();
    fetchBookingData();
  }, [actionListPlace]);

  // Watch for changes in places and refetch bookings
  useEffect(() => {
    if (places.length > 0) {
      fetchBookingData();
    }
  }, [places]);

  const fetchBookingData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllBookingsWithPaymentAPI();
      if (response.data.success) {
        // Filter bookings for places owned by current user
        const userBookings = response.data.bookings.filter((booking) =>
          places.some(
            (place) => place.id === booking.placeId && place.userId === user?.id
          )
        );
        setBookings(userBookings);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setLoading(false);
    }
  }, [places, user?.id]);

  // Memoize business stats calculation
  const businessStats = useMemo(() => {
    const userPlaces = places.filter((place) => place.userId === user?.id);
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.paymentAmount || 0);
    }, 0);

    const confirmedBookings = bookings.filter(
      (booking) =>
        booking.paymentStatus === "confirmed" ||
        booking.paymentStatus === "paid"
    );

    const averageRating =
      userPlaces.length > 0
        ? userPlaces.reduce((sum, place) => sum + (place.rating || 0), 0) /
          userPlaces.length
        : 0;

    return {
      totalPlaces: userPlaces.length,
      totalBookings: bookings.length,
      totalRevenue: totalRevenue,
      activeListings: userPlaces.filter((place) => place.isActive !== false)
        .length,
      confirmedBookings: confirmedBookings.length,
      averageRating: averageRating,
    };
  }, [places, bookings, user?.id]);

  // Memoize revenue data calculation
  const revenueData = useMemo(() => {
    const monthlyData = {};

    bookings.forEach((booking) => {
      if (booking.createdAt && booking.paymentAmount) {
        const date = new Date(booking.createdAt);
        const monthKey = date.toLocaleDateString("th-TH", { month: "short" });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, revenue: 0, bookings: 0 };
        }

        monthlyData[monthKey].revenue += booking.paymentAmount;
        monthlyData[monthKey].bookings += 1;
      }
    });

    return Object.values(monthlyData).slice(-6); // Last 6 months
  }, [bookings]);

  // Memoize booking status data calculation
  const bookingStatusData = useMemo(() => {
    const statusCounts = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    };

    bookings.forEach((booking) => {
      if (
        booking.paymentStatus === "confirmed" ||
        booking.paymentStatus === "paid"
      ) {
        statusCounts.confirmed++;
      } else if (booking.paymentStatus === "pending") {
        statusCounts.pending++;
      } else {
        statusCounts.cancelled++;
      }
    });

    return [
      { name: "ยืนยันแล้ว", value: statusCounts.confirmed, color: "#10b981" },
      { name: "รอยืนยัน", value: statusCounts.pending, color: "#f59e0b" },
      { name: "ยกเลิก", value: statusCounts.cancelled, color: "#ef4444" },
    ];
  }, [bookings]);

  // Memoize recent bookings
  const recentBookings = useMemo(() => {
    return bookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [bookings]);

  // Memoize top places calculation
  const topPlaces = useMemo(() => {
    const userPlaces = places.filter((place) => place.userId === user?.id);

    return userPlaces
      .map((place) => {
        const placeBookings = bookings.filter(
          (booking) => booking.placeId === place.id
        );
        const revenue = placeBookings.reduce(
          (sum, booking) => sum + (booking.paymentAmount || 0),
          0
        );

        return {
          id: place.id,
          name: place.title,
          bookings: placeBookings.length,
          revenue: revenue,
          rating: place.rating || 0,
          image: place.images?.[0] || "/placeholder.jpg",
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [places, bookings, user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return "ยืนยันแล้ว";
      case "pending":
        return "รอยืนยัน";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ดธุรกิจ</h1>
            <p className="text-gray-600 mt-1">
              ภาพรวมประสิทธิภาพและรายได้ของธุรกิจที่พักของคุณ
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              สัปดาห์นี้
            </Button>
            <Button>
              <TrendingUp className="w-4 h-4 mr-2" />
              ดูรายงาน
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ที่พักทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {businessStats.totalPlaces}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2 จากเดือนที่แล้ว
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">การจองทั้งหมด</p>
                  <p className="text-2xl font-bold text-green-600">
                    {businessStats.totalBookings}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% จากเดือนที่แล้ว
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">รายได้รวม</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ฿{businessStats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.5% จากเดือนที่แล้ว
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">อัตราการเข้าพัก</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {businessStats.occupancyRate}%
                  </p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -2% จากเดือนที่แล้ว
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions / Management Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/business/create-listing">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">สร้างที่พัก</p>
                    <p className="text-sm text-gray-600">เพิ่มที่พักใหม่</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/business/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">จัดการการจอง</p>
                    <p className="text-sm text-gray-600">ดูและจัดการจอง</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/business/payments">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">จัดการการชำระ</p>
                    <p className="text-sm text-gray-600">ดูสถานะการชำระ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/business/edit-places">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Edit className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">แก้ไขที่พัก</p>
                    <p className="text-sm text-gray-600">จัดการที่พักของคุณ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                รายได้รายเดือน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? `฿${value.toLocaleString()}` : value,
                      name === "revenue" ? "รายได้" : "การจอง",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Booking Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                สถานะการจอง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings and Top Places */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  การจองล่าสุด
                </div>
                <Button variant="outline" size="sm">
                  ดูทั้งหมด
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {booking.User?.firstName} {booking.User?.lastName}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            booking.paymentStatus
                          )}`}
                        >
                          {getStatusText(booking.paymentStatus)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {booking.Place?.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.checkInDate).toLocaleDateString(
                          "th-TH"
                        )}{" "}
                        -{" "}
                        {new Date(booking.checkOutDate).toLocaleDateString(
                          "th-TH"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ฿{booking.paymentAmount?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Places */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  ที่พักยอดนิยม
                </div>
                <Button variant="outline" size="sm">
                  จัดการที่พัก
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPlaces.map((place, index) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{place.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{place.bookings} การจอง</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {place.rating}
                        </span>
                        <span>{place.occupancy}% เข้าพัก</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ฿{place.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">รายได้</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
