import { AppSidebar } from "@/components/app-sidebar";
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
} from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import usePlaceStore from "@/store/usePlaceStore";
import useUserStore from "@/store/useUserStore";

function Dashboard() {
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);
  const users = useUserStore((state) => state.users);
  const actionReadUser = useUserStore((state) => state.actionReadUser);

  useEffect(() => {
    actionListPlace();
    actionReadUser();
  }, [actionListPlace, actionReadUser]);

  // Calculate statistics
  const totalPlaces = Array.isArray(places) ? places.length : 0;
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const totalRevenue = Array.isArray(places)
    ? places.reduce((sum, place) => sum + (place.price || 0), 0)
    : 0;
  const averagePrice =
    totalPlaces > 0 ? Math.round(totalRevenue / totalPlaces) : 0;

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
              <p className="text-xs text-blue-100">+2 จากเดือนที่แล้ว</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                ผู้ใช้งาน
              </CardTitle>
              <Users className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-green-100">+5 จากเดือนที่แล้ว</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                ราคาเฉลี่ย
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ฿{averagePrice.toLocaleString()}
              </div>
              <p className="text-xs text-purple-100">ต่อคืน</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                การจองเดือนนี้
              </CardTitle>
              <Calendar className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-orange-100">+12% จากเดือนที่แล้ว</p>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Places Table */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Building className="w-5 h-5" />
                    ที่พักล่าสุด
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    รายการที่พักที่เพิ่มเข้ามาล่าสุด
                  </CardDescription>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link to="/admin/manage-list">ดูทั้งหมด</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ชื่อที่พัก</TableHead>
                    <TableHead className="font-semibold">ประเภท</TableHead>
                    <TableHead className="font-semibold">ราคา</TableHead>
                    <TableHead className="text-center font-semibold">
                      จัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(places || []).slice(0, 5).map((place) => (
                    <TableRow key={place.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 truncate max-w-[150px]">
                            {place.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {place.lat?.toFixed(2)}, {place.lng?.toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(place.category)}>
                          {place.category || "ไม่ระบุ"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-700">
                            {place.price?.toLocaleString() || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Link to={`/admin/manage-list/${place.id}`}>
                              <Edit className="w-3 h-3" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!Array.isArray(places) || places.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        ไม่มีข้อมูลที่พัก
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Users className="w-5 h-5" />
                    ผู้ใช้งานล่าสุด
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    ผู้ใช้งานที่ลงทะเบียนล่าสุด
                  </CardDescription>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Link to="/admin/manage-user">ดูทั้งหมด</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ชื่อผู้ใช้</TableHead>
                    <TableHead className="font-semibold">อีเมล</TableHead>
                    <TableHead className="font-semibold">สถานะ</TableHead>
                    <TableHead className="text-center font-semibold">
                      จัดการ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(users) &&
                    users.slice(0, 5).map((user, index) => (
                      <TableRow
                        key={user.id || index}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-700">
                                {user.name?.charAt(0) ||
                                  user.email?.charAt(0) ||
                                  "U"}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {user.name || "ไม่ระบุชื่อ"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            ใช้งานอยู่
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {(!Array.isArray(users) || users.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        ไม่มีข้อมูลผู้ใช้งาน
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <BarChart3 className="w-5 h-5" />
              การดำเนินการด่วน
            </CardTitle>
            <CardDescription className="text-indigo-700">
              เครื่องมือจัดการที่ใช้บ่อย
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                asChild
                className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Link to="/admin/create-listing">
                  <Building className="w-6 h-6" />
                  เพิ่มที่พักใหม่
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-20 flex-col gap-2 border-green-300 hover:bg-green-50"
              >
                <Link to="/admin/manage-list">
                  <Eye className="w-6 h-6 text-green-600" />
                  จัดการที่พัก
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-20 flex-col gap-2 border-purple-300 hover:bg-purple-50"
              >
                <Link to="/admin/manage-user">
                  <Users className="w-6 h-6 text-purple-600" />
                  จัดการผู้ใช้
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-20 flex-col gap-2 border-orange-300 hover:bg-orange-50"
              >
                <Link to="/admin/reports">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  ดูรายงาน
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
export default Dashboard;
