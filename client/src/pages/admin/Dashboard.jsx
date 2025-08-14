import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Building,
  DollarSign,
  Eye,
  Edit,
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import usePlaceStore from "@/store/usePlaceStore";
import useUserStore from "@/store/useUserStore";
import { getAllBookingsWithPaymentAPI } from "@/api/paymentAPI";

function Dashboard() {
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);
  const users = useUserStore((state) => state.users);
  const actionReadUser = useUserStore((state) => state.actionReadUser);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    actionListPlace();
    actionReadUser();
    fetchBookingData();
  }, [actionListPlace, actionReadUser]);

  const fetchBookingData = async () => {
    try {
      setLoadingBookings(true);
      const response = await getAllBookingsWithPaymentAPI();
      const bookingsData = response.data?.bookings || response.data?.data || [];
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Calculate statistics
  const totalPlaces = Array.isArray(places) ? places.length : 0;
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(
      (b) => b.paymentStatus === "paid" || b.paymentStatus === "confirmed"
    )
    .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

  // Booking statistics
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  // Recent bookings (last 5)
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "รอยืนยัน",
        className: "bg-yellow-100 text-yellow-800",
      },
      confirmed: {
        label: "ยืนยันแล้ว",
        className: "bg-blue-100 text-blue-800",
      },
      completed: {
        label: "เสร็จสิ้น",
        className: "bg-green-100 text-green-800",
      },
      cancelled: { label: "ยกเลิก", className: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryColor = (category) => {
    const colors = {
      resort: "bg-green-100 text-green-800 border-green-200",
      hotel: "bg-blue-100 text-blue-800 border-blue-200",
      hostel: "bg-purple-100 text-purple-800 border-purple-200",
      guesthouse: "bg-orange-100 text-orange-800 border-orange-200",
      apartment: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <h1 className="text-lg font-semibold">แดชบอร์ดผู้ดูแลระบบ</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                ที่พักทั้งหมด
              </CardTitle>
              <Building className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlaces}</div>
              <p className="text-xs text-blue-100">สถานที่ที่ลงทะเบียน</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                รายได้รวม
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-green-100">จากการจองที่ชำระแล้ว</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                การจองทั้งหมด
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-purple-100">การจองในระบบ</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                ผู้ใช้ทั้งหมด
              </CardTitle>
              <Users className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-orange-100">บัญชีผู้ใช้ในระบบ</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Status Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">รอยืนยัน</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingBookings}
              </div>
              <p className="text-xs text-muted-foreground">การจองที่รอยืนยัน</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ยืนยันแล้ว</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {confirmedBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                การจองที่ยืนยันแล้ว
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
              <Star className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedBookings}
              </div>
              <p className="text-xs text-muted-foreground">
                การจองที่เสร็จสิ้น
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ยกเลิก</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {cancelledBookings}
              </div>
              <p className="text-xs text-muted-foreground">การจองที่ยกเลิก</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/admin/analytics" className="block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  ดูสถิติและการวิเคราะห์
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/admin/bookings" className="block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  จัดการการจอง
                </CardTitle>
                <Calendar className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  จัดการการจองทั้งหมด
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/admin/payments" className="block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  จัดการการชำระเงิน
                </CardTitle>
                <CreditCard className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  ตรวจสอบการชำระเงิน
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/admin/manage-user" className="block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  จัดการผู้ใช้
                </CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  จัดการบัญชีผู้ใช้
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Bookings and Places */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                การจองล่าสุด
              </CardTitle>
              <CardDescription>การจอง รายการล่าสุด</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">กำลังโหลด...</p>
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {booking.Place?.title || "ไม่ระบุสถานที่"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ห้อง: {booking.Room?.name || "ไม่ระบุ"} •{" "}
                          {formatCurrency(booking.totalPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(booking.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(booking.createdAt).toLocaleDateString(
                            "th-TH"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">ยังไม่มีการจอง</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Places */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                ที่พักล่าสุด
              </CardTitle>
              <CardDescription>ที่พัก  รายการล่าสุด</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(places) && places.length > 0 ? (
                <div className="space-y-3">
                  {places.slice(0, 5).map((place) => (
                    <div
                      key={place.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{place.title}</p>
                        <p className="text-xs text-gray-500">
                          {place.category || "ไม่ระบุประเภท"} • ฿
                          {place.price?.toLocaleString() || 0}/คืน
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getCategoryColor(place.category)}>
                          {place.category || "ไม่ระบุ"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">ยังไม่มีที่พัก</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}

export default Dashboard;
