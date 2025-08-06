import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

const BusinessDashboard = () => {
  const [dateRange, setDateRange] = useState("30days");

  // Simulated business data
  const businessStats = {
    totalPlaces: 8,
    totalBookings: 156,
    totalRevenue: 125000,
    activeListings: 6,
    occupancyRate: 78,
    averageRating: 4.6,
  };

  const revenueData = [
    { month: "ม.ค.", revenue: 45000, bookings: 23 },
    { month: "ก.พ.", revenue: 52000, bookings: 28 },
    { month: "มี.ค.", revenue: 48000, bookings: 25 },
    { month: "เม.ย.", revenue: 61000, bookings: 32 },
    { month: "พ.ค.", revenue: 55000, bookings: 29 },
    { month: "มิ.ย.", revenue: 67000, bookings: 35 },
  ];

  const bookingStatusData = [
    { name: "ยืนยันแล้ว", value: 128, color: "#10b981" },
    { name: "รอยืนยัน", value: 15, color: "#f59e0b" },
    { name: "ยกเลิก", value: 13, color: "#ef4444" },
  ];

  const recentBookings = [
    {
      id: "BK001",
      guestName: "คุณสมชาย ใจดี",
      placeName: "Villa Sunset View",
      checkIn: "2024-02-15",
      checkOut: "2024-02-17",
      total: 4500,
      status: "confirmed",
    },
    {
      id: "BK002",
      guestName: "คุณมาลี สวยงาม",
      placeName: "Beach House Deluxe",
      checkIn: "2024-02-18",
      checkOut: "2024-02-20",
      total: 6800,
      status: "pending",
    },
    {
      id: "BK003",
      guestName: "คุณประยุทธ ทองคำ",
      placeName: "Mountain Resort",
      checkIn: "2024-02-20",
      checkOut: "2024-02-22",
      total: 3200,
      status: "confirmed",
    },
  ];

  const topPlaces = [
    {
      id: 1,
      name: "Villa Sunset View",
      bookings: 45,
      revenue: 67500,
      rating: 4.8,
      occupancy: 85,
    },
    {
      id: 2,
      name: "Beach House Deluxe",
      bookings: 38,
      revenue: 52000,
      rating: 4.6,
      occupancy: 78,
    },
    {
      id: 3,
      name: "Mountain Resort",
      bookings: 32,
      revenue: 41000,
      rating: 4.5,
      occupancy: 72,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
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
                        <p className="font-medium">{booking.guestName}</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {booking.placeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.checkIn).toLocaleDateString("th-TH")}{" "}
                        -{" "}
                        {new Date(booking.checkOut).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ฿{booking.total.toLocaleString()}
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
