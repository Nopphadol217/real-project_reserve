import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Building2,
  BarChart3,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { getAllBookingsWithPaymentAPI } from "@/api/paymentAPI";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [timeRange, setTimeRange] = useState("30"); // days
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await getAllBookingsWithPaymentAPI();

      // ใช้ข้อมูลจาก response ที่มีอยู่
      const bookingsData = response.data?.bookings || response.data?.data || [];
      setBookings(bookingsData);

      console.log("Analytics data:", bookingsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูลสถิติ");
    } finally {
      setLoading(false);
    }
  };

  // คำนวณสถิติต่างๆ
  const calculateStats = () => {
    const now = new Date();
    const daysAgo = new Date(
      now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000
    );

    const filteredBookings = bookings.filter(
      (booking) => new Date(booking.createdAt) >= daysAgo
    );

    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings
      .filter(
        (b) => b.paymentStatus === "paid" || b.paymentStatus === "confirmed"
      )
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    const completedBookings = filteredBookings.filter(
      (b) => b.status === "completed"
    ).length;
    const pendingBookings = filteredBookings.filter(
      (b) => b.status === "pending"
    ).length;
    const confirmedBookings = filteredBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const cancelledBookings = filteredBookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    // คำนวณ growth rate (เปรียบเทียบกับช่วงก่อนหน้า)
    const previousPeriodEnd = daysAgo;
    const previousPeriodStart = new Date(
      previousPeriodEnd.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000
    );

    const previousBookings = bookings.filter((booking) => {
      const date = new Date(booking.createdAt);
      return date >= previousPeriodStart && date < previousPeriodEnd;
    });

    const previousRevenue = previousBookings
      .filter(
        (b) => b.paymentStatus === "paid" || b.paymentStatus === "confirmed"
      )
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    const revenueGrowth =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : totalRevenue > 0
        ? 100
        : 0;

    const bookingGrowth =
      previousBookings.length > 0
        ? ((totalBookings - previousBookings.length) /
            previousBookings.length) *
          100
        : totalBookings > 0
        ? 100
        : 0;

    return {
      totalBookings,
      totalRevenue,
      completedBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      revenueGrowth,
      bookingGrowth,
      filteredBookings,
    };
  };

  // เตรียมข้อมูลสำหรับ charts
  const prepareChartData = () => {
    const stats = calculateStats();
    const { filteredBookings } = stats;

    // Revenue by day
    const revenueByDay = {};
    filteredBookings.forEach((booking) => {
      if (
        booking.paymentStatus === "paid" ||
        booking.paymentStatus === "confirmed"
      ) {
        const date = new Date(booking.createdAt).toLocaleDateString("th-TH");
        revenueByDay[date] = (revenueByDay[date] || 0) + booking.totalPrice;
      }
    });

    const revenueData = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14); // แสดงแค่ 14 วันล่าสุด

    // Bookings by status
    const statusData = [
      { name: "เสร็จสิ้น", value: stats.completedBookings, color: "#22c55e" },
      { name: "ยืนยันแล้ว", value: stats.confirmedBookings, color: "#3b82f6" },
      { name: "รอยืนยัน", value: stats.pendingBookings, color: "#f59e0b" },
      { name: "ยกเลิก", value: stats.cancelledBookings, color: "#ef4444" },
    ];

    // Popular places
    const placeBookings = {};
    filteredBookings.forEach((booking) => {
      const placeName = booking.Place?.title || "ไม่ระบุ";
      placeBookings[placeName] = (placeBookings[placeName] || 0) + 1;
    });

    const popularPlaces = Object.entries(placeBookings)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10);

    return {
      revenueData,
      statusData,
      popularPlaces,
      stats,
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลสถิติ...</p>
        </div>
      </div>
    );
  }

  const { revenueData, statusData, popularPlaces, stats } = prepareChartData();

  return (
    <div className="space-y-6 mx-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">สถิติและการวิเคราะห์ข้อมูลธุรกิจ</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 วันล่าสุด</SelectItem>
              <SelectItem value="30">30 วันล่าสุด</SelectItem>
              <SelectItem value="90">90 วันล่าสุด</SelectItem>
              <SelectItem value="365">1 ปีล่าสุด</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline">
            รีเฟรชข้อมูล
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">จำนวนการจองทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalBookings}
                </p>
                <div className="flex items-center mt-2">
                  {stats.bookingGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stats.bookingGrowth >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {formatPercentage(stats.bookingGrowth)}
                  </span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รายได้รวม</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  {stats.revenueGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stats.revenueGrowth >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {formatPercentage(stats.revenueGrowth)}
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">การจองที่ยืนยันแล้ว</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.confirmedBookings}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.totalBookings > 0
                    ? Math.round(
                        (stats.confirmedBookings / stats.totalBookings) * 100
                      )
                    : 0}
                  % ของทั้งหมด
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">อัตราความสำเร็จ</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.totalBookings > 0
                    ? Math.round(
                        ((stats.completedBookings + stats.confirmedBookings) /
                          stats.totalBookings) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  เสร็จสิ้น + ยืนยันแล้ว
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="revenue">รายได้</TabsTrigger>
          <TabsTrigger value="bookings">การจอง</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>การกระจายตัวตามสถานะ</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Popular Places */}
            <Card>
              <CardHeader>
                <CardTitle>ที่พักยอดนิยม</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularPlaces}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>แนวโน้มรายได้ (14 วันล่าสุด)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    tickFormatter={(value) => `฿${value.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "รายได้"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>สถิติการจองรายวัน</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    name="รายได้ (บาท)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
