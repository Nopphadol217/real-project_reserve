import { useState, useEffect, use } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  CreditCard,
  AlertCircle,
  Download,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPendingPaymentsAPI,
  getAllBookingsWithPaymentAPI,
  confirmPaymentAPI,
  rejectPaymentAPI,
} from "@/api/paymentAPI";

const PaymentManagement = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showSlipDialog, setShowSlipDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Helper function to safely display user info
  const formatUserInfo = (user) => {
    if (!user) return { name: "N/A", email: "N/A" };
    return {
      name: `${user.firstname || "N/A"} ${user.lastname || ""}`.trim(),
      email: user.email || "N/A",
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, bookingsRes] = await Promise.all([
        getPendingPaymentsAPI(),
        getAllBookingsWithPaymentAPI(),
      ]);

      console.log("PaymentManagement - Pending Response:", pendingRes);
      console.log("PaymentManagement - Bookings Response:", bookingsRes);

      // ปรับให้รองรับทั้งสองรูปแบบ response
      const pendingData =
        pendingRes.data?.data || pendingRes.data?.bookings || [];
      const bookingsData =
        bookingsRes.data?.data || bookingsRes.data?.bookings || [];

      setPendingPayments(pendingData);
      setAllBookings(bookingsData);

      console.log("PaymentManagement - Set pending:", pendingData);
      console.log("PaymentManagement - Set bookings:", bookingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (bookingId) => {
    try {
      await confirmPaymentAPI(bookingId);
      toast.success("ยืนยันการชำระเงินสำเร็จ");
      fetchData(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedBooking) return;

    try {
      await rejectPaymentAPI(selectedBooking.id, rejectReason);
      toast.success("ปฏิเสธการชำระเงินสำเร็จ");
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedBooking(null);
      fetchData(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("เกิดข้อผิดพลาดในการปฏิเสธการชำระเงิน");
    }
  };

  const handleConfirmBookingAndPayment = async (bookingId) => {
    try {
      // For Stripe payments that are paid but booking status is still pending
      await confirmPaymentAPI(bookingId);
      toast.success("ยืนยันการจองและการชำระเงินสำเร็จ");
      fetchData(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Error confirming booking and payment:", error);
      toast.error("เกิดข้อผิดพลาดในการยืนยันการจองและการชำระเงิน");
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
    // ถ้ามี paymentSlip แสดงว่าชำระผ่าน Bank Transfer
    if (booking.paymentSlip) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          โอนธนาคาร
        </Badge>
      );
    }
    // ถ้าไม่มี paymentSlip แต่มี paymentStatus = paid หรือ confirmed แสดงว่าชำระผ่าน Stripe
    else if (
      booking.paymentStatus === "paid" ||
      booking.paymentStatus === "confirmed"
    ) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          Stripe
        </Badge>
      );
    }
    // ถ้าสถานะ pending และไม่มี slip แสดงว่าเป็น Stripe ที่ยังไม่ได้ชำระ
    else if (booking.paymentStatus === "pending") {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Stripe (รอชำระ)
        </Badge>
      );
    }
    return null;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
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
            จัดการการชำระเงิน
          </h1>
          <p className="text-gray-600 mt-1">
            ตรวจสอบและยืนยันการชำระเงินจากลูกค้า
          </p>
        </div>
        <Button onClick={fetchData} variant="outline">
          รีเฟรชข้อมูล
        </Button>
      </div>

      {/* สถิติการชำระเงิน */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รอตรวจสอบ</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingPayments.length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ชำระแล้ว</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    allBookings.filter(
                      (b) =>
                        b.paymentStatus === "paid" ||
                        b.paymentStatus === "confirmed"
                    ).length
                  }
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
                <p className="text-sm text-gray-600">ปฏิเสธ</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    allBookings.filter((b) => b.paymentStatus === "rejected")
                      .length
                  }
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">
                  {allBookings.length}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            รอตรวจสอบ ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            ชำระแล้ว (
            {
              allBookings.filter(
                (b) =>
                  b.paymentStatus === "paid" || b.paymentStatus === "confirmed"
              ).length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="unpaid" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            ยังไม่ชำระ (
            {allBookings.filter((b) => b.paymentStatus === "unpaid").length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            ทั้งหมด ({allBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>การชำระเงินที่รอตรวจสอบ</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ไม่มีการชำระเงินที่รอตรวจสอบ
                  </h3>
                  <p className="text-gray-600">
                    การชำระเงินทั้งหมดได้รับการตรวจสอบแล้ว
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>การจอง</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead>ยอดเงิน</TableHead>
                      <TableHead>วิธีการชำระ</TableHead>
                      <TableHead>สถานะการจอง</TableHead>
                      <TableHead>วันที่จอง</TableHead>
                      <TableHead>สลิป</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{booking.Place.title}</p>
                            <p className="text-sm text-gray-600">
                              ห้อง: {booking.Room.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{booking.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {formatUserInfo(booking.User).name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatUserInfo(booking.User).email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-bold text-green-600">
                            {formatCurrency(booking.totalPrice)}
                          </p>
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
                          {booking.paymentSlip ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowSlipDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดูสลิป
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-500">
                              ไม่มีสลิป
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {booking.paymentSlip ? (
                              // Bank Transfer Payment - รอตรวจสอบสลิป
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleConfirmPayment(booking.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  อนุมัติสลิป
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  ปฏิเสธสลิป
                                </Button>
                              </>
                            ) : (
                              // Stripe Payment - รอการชำระเงิน
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowRejectDialog(true);
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                ยกเลิกการจอง
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>การจองที่ชำระเงินแล้ว</CardTitle>
            </CardHeader>
            <CardContent>
              {allBookings.filter(
                (b) =>
                  b.paymentStatus === "paid" || b.paymentStatus === "confirmed"
              ).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ยังไม่มีการจองที่ชำระเงินแล้ว
                  </h3>
                  <p className="text-gray-600">
                    เมื่อลูกค้าชำระเงินแล้วจะแสดงที่นี่
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>การจอง</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead>ยอดเงิน</TableHead>
                      <TableHead>สถานะการชำระ</TableHead>
                      <TableHead>วิธีการชำระ</TableHead>
                      <TableHead>สถานะการจอง</TableHead>
                      <TableHead>วันที่จอง</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allBookings
                      .filter(
                        (b) =>
                          b.paymentStatus === "paid" ||
                          b.paymentStatus === "confirmed"
                      )
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">
                                {booking.Place.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                ห้อง: {booking.Room.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                #{booking.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">
                                {formatUserInfo(booking.User).name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatUserInfo(booking.User).email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-green-600">
                              {formatCurrency(booking.totalPrice)}
                            </p>
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodBadge(booking)}
                          </TableCell>
                          <TableCell>
                            {getBookingStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {formatDate(booking.createdAt)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {booking.paymentSlip && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowSlipDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  ดูสลิป
                                </Button>
                              )}
                              {!booking.paymentSlip &&
                                booking.paymentStatus === "paid" &&
                                booking.status === "pending" && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                      handleConfirmBookingAndPayment(booking.id)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    ยืนยันการจอง
                                  </Button>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unpaid">
          <Card>
            <CardHeader>
              <CardTitle>การจองที่ยังไม่ชำระเงิน</CardTitle>
            </CardHeader>
            <CardContent>
              {allBookings.filter((b) => b.paymentStatus === "unpaid")
                .length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ไม่มีการจองที่ยังไม่ชำระเงิน
                  </h3>
                  <p className="text-gray-600">
                    การจองทั้งหมดได้รับการชำระเงินแล้ว
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>การจอง</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead>ยอดเงิน</TableHead>
                      <TableHead>สถานะการชำระ</TableHead>
                      <TableHead>วิธีการชำระ</TableHead>
                      <TableHead>สถานะการจอง</TableHead>
                      <TableHead>วันที่จอง</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allBookings
                      .filter((b) => b.paymentStatus === "unpaid")
                      .map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">
                                {booking.Place.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                ห้อง: {booking.Room.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                #{booking.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">
                                {formatUserInfo(booking.User).name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatUserInfo(booking.User).email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-orange-600">
                              {formatCurrency(booking.totalPrice)}
                            </p>
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodBadge(booking)}
                          </TableCell>
                          <TableCell>
                            {getBookingStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {formatDate(booking.createdAt)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowRejectDialog(true);
                                }}
                              >
                                <X className="w-4 h-4 mr-1" />
                                ยกเลิกการจอง
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>การจองทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>การจอง</TableHead>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead>ยอดเงิน</TableHead>
                    <TableHead>สถานะการชำระ</TableHead>
                    <TableHead>วิธีการชำระ</TableHead>
                    <TableHead>สถานะการจอง</TableHead>
                    <TableHead>วันที่จอง</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{booking.Place.title}</p>
                          <p className="text-sm text-gray-600">
                            ห้อง: {booking.Room.name}
                          </p>
                          <p className="text-xs text-gray-500">#{booking.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {formatUserInfo(booking.User).name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatUserInfo(booking.User).email}
                          </p>
                        </div>
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
                        <div className="flex space-x-2">
                          {booking.paymentSlip && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowSlipDialog(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดูสลิป
                            </Button>
                          )}
                          {/* Bank Transfer - ปุ่มสำหรับสลิปที่รอตรวจสอบ */}
                          {booking.paymentSlip &&
                            booking.paymentStatus === "pending" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    handleConfirmPayment(booking.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  อนุมัติสลิป
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowRejectDialog(true);
                                  }}
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  ปฏิเสธสลิป
                                </Button>
                              </>
                            )}
                          {/* Stripe - ปุ่มสำหรับการจองที่ชำระผ่าน Stripe แล้วแต่ยังไม่ได้ยืนยันการจอง */}
                          {!booking.paymentSlip &&
                            booking.paymentStatus === "paid" &&
                            booking.status === "pending" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleConfirmBookingAndPayment(booking.id)
                                }
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                ยืนยันการจอง
                              </Button>
                            )}
                          {/* Cancel - ปุ่มสำหรับยกเลิกการจองที่ยังไม่ได้ชำระ */}
                          {booking.paymentStatus === "pending" &&
                            !booking.paymentSlip && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowRejectDialog(true);
                                }}
                              >
                                <X className="w-4 h-4 mr-1" />
                                ยกเลิกการจอง
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
        </TabsContent>
      </Tabs>

      {/* Dialog สำหรับดูสลิป */}
      <Dialog open={showSlipDialog} onOpenChange={setShowSlipDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>สลิปการโอนเงิน</DialogTitle>
            <DialogDescription>
              การจอง #{selectedBooking?.id} - {selectedBooking?.Place?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking?.paymentSlip && (
            <div className="flex flex-col items-center space-y-4">
              <img
                src={selectedBooking.paymentSlip}
                alt="Payment Slip"
                className="max-w-full h-auto rounded-lg border"
                style={{ maxHeight: "400px" }}
              />
              <Button
                variant="outline"
                onClick={() =>
                  window.open(selectedBooking.paymentSlip, "_blank")
                }
              >
                <Download className="w-4 h-4 mr-2" />
                ดาวน์โหลด
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog สำหรับปฏิเสธ */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBooking?.paymentSlip
                ? "ปฏิเสธสลิปการโอนเงิน"
                : "ยกเลิกการจอง"}
            </DialogTitle>
            <DialogDescription>
              การจอง #{selectedBooking?.id} - {selectedBooking?.Place?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {selectedBooking?.paymentSlip
                ? "กรุณาระบุเหตุผลในการปฏิเสธสลิปการโอนเงิน"
                : "กรุณาระบุเหตุผลในการยกเลิกการจอง"}
            </p>
            <Textarea
              placeholder={
                selectedBooking?.paymentSlip
                  ? "เช่น สลิปการโอนเงินไม่ชัดเจน, ยอดเงินไม่ตรง, etc."
                  : "เช่น ลูกค้าไม่ชำระเงินตามกำหนด, ยกเลิกตามคำร้องขอ, etc."
              }
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason("");
              }}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectPayment}
              disabled={!rejectReason.trim()}
            >
              {selectedBooking?.paymentSlip ? "ปฏิเสธสลิป" : "ยกเลิกการจอง"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManagement;
