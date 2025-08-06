import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Edit,
  Search,
  UserCog,
  Crown,
  Building2,
  User,
  Shield,
  Power,
  PowerOff,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";
import { updateUserAPI } from "@/api/userAPI";

const UserManage = () => {
  const actionReadUser = useUserStore((state) => state.actionReadUser);
  const users = useUserStore((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    enabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    actionReadUser();
  }, [actionReadUser]);

  // Filter users based on search term
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      role: user.role || "USER",
      enabled: user.enabled !== false,
    });
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await updateUserAPI(selectedUser.id, editForm);

      toast.success("อัปเดตข้อมูลผู้ใช้สำเร็จ");
      setShowEditDialog(false);
      setSelectedUser(null);
      actionReadUser(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const newStatus = !user.enabled;
      await updateUserAPI(user.id, { enabled: newStatus });

      toast.success(
        newStatus ? "เปิดใช้งานบัญชีสำเร็จ" : "ปิดใช้งานบัญชีสำเร็จ"
      );
      actionReadUser(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะบัญชี");
    }
  };

  // Business approval functions
  const openBusinessDialog = (user) => {
    setSelectedUser(user);
    setShowBusinessDialog(true);
  };

  const approveBusinessUser = async (userId) => {
    try {
      await updateUserAPI(userId, {
        status: "approved",
        enabled: true,
      });

      toast.success("อนุมัติผู้ประกอบการสำเร็จ");
      actionReadUser(); // รีเฟรชข้อมูลจาก API
      setShowBusinessDialog(false);
    } catch (error) {
      console.error("Error approving business user:", error);
      toast.error("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const rejectBusinessUser = async (userId) => {
    try {
      await updateUserAPI(userId, {
        status: "rejected",
        enabled: false,
      });

      toast.success("ปฏิเสธผู้ประกอบการสำเร็จ");
      actionReadUser(); // รีเฟรชข้อมูลจาก API
      setShowBusinessDialog(false);
    } catch (error) {
      console.error("Error rejecting business user:", error);
      toast.error("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  const getBusinessStatusBadge = (user) => {
    if (user.role !== "BUSINESS") return null;

    const status = user.status || "pending";
    const statusConfig = {
      pending: {
        label: "รออนุมัติ",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
      approved: {
        label: "อนุมัติแล้ว",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      rejected: {
        label: "ปฏิเสธ",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: {
        label: "ผู้ดูแลระบบ",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: Crown,
      },
      BUSINESS: {
        label: "ผู้ประกอบการ",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Building2,
      },
      USER: {
        label: "ผู้ใช้ทั่วไป",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: User,
      },
    };

    const config = roleConfig[role] || roleConfig.USER;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (enabled) => {
    return enabled ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Power className="w-3 h-3 mr-1" />
        ใช้งานได้
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <PowerOff className="w-3 h-3 mr-1" />
        ปิดใช้งาน
      </Badge>
    );
  };

  const getUserStats = () => {
    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter((u) => u.enabled !== false).length;
    const adminCount = filteredUsers.filter((u) => u.role === "ADMIN").length;
    const businessCount = filteredUsers.filter(
      (u) => u.role === "BUSINESS"
    ).length;
    const userCount = filteredUsers.filter((u) => u.role === "USER").length;

    return { totalUsers, activeUsers, adminCount, businessCount, userCount };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6 mx-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h1>
          <p className="text-gray-600 mt-1">
            จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง
          </p>
        </div>
        <Button onClick={actionReadUser} variant="outline">
          รีเฟรชข้อมูล
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ใช้งานได้</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeUsers}
                </p>
              </div>
              <Power className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ผู้ดูแลระบบ</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.adminCount}
                </p>
              </div>
              <Crown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ผู้ประกอบการ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.businessCount}
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
                <p className="text-sm text-gray-600">ผู้ใช้ทั่วไป</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.userCount}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ค้นหาด้วยชื่อ, อีเมล, หรือบทบาท..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            รายการผู้ใช้
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ข้อมูลผู้ใช้</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>สถานะธุรกิจ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สมัคร</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={user.enabled === false ? "opacity-60" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.firstname?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {user.firstname} {user.lastname}
                          </p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getBusinessStatusBadge(user)}</TableCell>
                    <TableCell>{getStatusBadge(user.enabled)}</TableCell>
                    <TableCell>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("th-TH")
                        : "ไม่ระบุ"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          แก้ไข
                        </Button>

                        {user.role === "BUSINESS" &&
                          user.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openBusinessDialog(user)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              ตรวจสอบ
                            </Button>
                          )}

                        <Button
                          size="sm"
                          variant={
                            user.enabled === false ? "default" : "destructive"
                          }
                          onClick={() => toggleUserStatus(user)}
                          className="flex items-center gap-2"
                        >
                          {user.enabled === false ? (
                            <>
                              <Power className="w-4 h-4" />
                              เปิด
                            </>
                          ) : (
                            <>
                              <PowerOff className="w-4 h-4" />
                              ปิด
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {searchTerm
                      ? "ไม่พบผู้ใช้ที่ตรงกับการค้นหา"
                      : "ไม่มีข้อมูลผู้ใช้"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              แก้ไขข้อมูลผู้ใช้
            </DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลและบทบาทของผู้ใช้: {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname">ชื่อ</Label>
                <Input
                  id="firstname"
                  value={editForm.firstname}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      firstname: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastname">นามสกุล</Label>
                <Input
                  id="lastname"
                  value={editForm.lastname}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      lastname: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="role">บทบาท</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      ผู้ใช้ทั่วไป
                    </div>
                  </SelectItem>
                  <SelectItem value="BUSINESS">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      ผู้ประกอบการ
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      ผู้ดูแลระบบ
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="enabled">สถานะบัญชี</Label>
              <Select
                value={editForm.enabled ? "true" : "false"}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    enabled: value === "true",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">
                    <div className="flex items-center gap-2">
                      <Power className="w-4 h-4 text-green-600" />
                      เปิดใช้งาน
                    </div>
                  </SelectItem>
                  <SelectItem value="false">
                    <div className="flex items-center gap-2">
                      <PowerOff className="w-4 h-4 text-red-600" />
                      ปิดใช้งาน
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleSaveUser} disabled={isLoading}>
              {isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Business Approval Dialog */}
      <Dialog open={showBusinessDialog} onOpenChange={setShowBusinessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              อนุมัติผู้ประกอบการ
            </DialogTitle>
            <DialogDescription>
              ตรวจสอบและอนุมัติใบสมัครผู้ประกอบการ
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-gray-900">ข้อมูลผู้สมัคร</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">ชื่อ:</span>
                    <span className="ml-2 font-medium">
                      {selectedUser.firstname} {selectedUser.lastname}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">อีเมล:</span>
                    <span className="ml-2 font-medium">
                      {selectedUser.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">เบอร์โทร:</span>
                    <span className="ml-2 font-medium">
                      {selectedUser.phone || "ไม่ระบุ"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">วันที่สมัคร:</span>
                    <span className="ml-2 font-medium">
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString(
                            "th-TH"
                          )
                        : "ไม่ระบุ"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedUser.businessName && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium text-blue-900">ข้อมูลธุรกิจ</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-600">ชื่อธุรกิจ:</span>
                      <span className="ml-2 font-medium">
                        {selectedUser.businessName}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">ประเภท:</span>
                      <span className="ml-2 font-medium">
                        {selectedUser.businessType || "ไม่ระบุ"}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600">ที่อยู่:</span>
                      <span className="ml-2 font-medium">
                        {selectedUser.businessAddress || "ไม่ระบุ"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm">สถานะปัจจุบัน: </span>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  รออนุมัติ
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBusinessDialog(false)}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedUser && rejectBusinessUser(selectedUser.id)
              }
              className="flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              ปฏิเสธ
            </Button>
            <Button
              onClick={() =>
                selectedUser && approveBusinessUser(selectedUser.id)
              }
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              อนุมัติ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManage;
