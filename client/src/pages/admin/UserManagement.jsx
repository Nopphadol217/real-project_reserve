import { useEffect, useState } from "react";
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
import {
  Search,
  UserCheck,
  UserX,
  Eye,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  getAllUsersAPI,
  approveBusinessUserAPI,
  rejectBusinessUserAPI,
} from "@/api/adminAPI";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsersAPI();

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.businessInfo?.businessName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      if (statusFilter === "pending") {
        filtered = filtered.filter((user) => user.role === "PENDING_BUSINESS");
      } else if (statusFilter === "approved") {
        filtered = filtered.filter((user) => user.role === "BUSINESS");
      } else if (statusFilter === "active") {
        filtered = filtered.filter((user) => user.role === "USER");
      }
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action) => {
    try {
      let response;

      if (action === "approve") {
        response = await approveBusinessUserAPI(userId);
      } else if (action === "reject") {
        response = await rejectBusinessUserAPI(userId, "ไม่ผ่านการตรวจสอบ");
      }

      if (response.data.success) {
        toast.success(
          action === "approve"
            ? "อนุมัติผู้ใช้เรียบร้อย"
            : "ปฏิเสธคำขอเรียบร้อย"
        );
        fetchUsers(); // Refresh list
        setShowApprovalModal(false);
        setSelectedUser(null);
      } else {
        toast.error(response.data.message || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("เกิดข้อผิดพลาดในการดำเนินการ");
    }
  };

  const openApprovalModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowApprovalModal(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "BUSINESS":
        return "bg-green-100 text-green-800";
      case "PENDING_BUSINESS":
        return "bg-yellow-100 text-yellow-800";
      case "USER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "ADMIN":
        return "ผู้ดูแลระบบ";
      case "BUSINESS":
        return "ผู้ประกอบการ";
      case "PENDING_BUSINESS":
        return "รอการอนุมัติ";
      case "USER":
        return "ผู้ใช้ทั่วไป";
      default:
        return role;
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), "d MMM yyyy, HH:mm", { locale: th });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          จัดการผู้ใช้งาน
        </h1>
        <p className="text-gray-600">อนุมัติ ปฏิเสธ และจัดการผู้ใช้งานในระบบ</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาผู้ใช้..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="ประเภทผู้ใช้" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                <SelectItem value="USER">ผู้ใช้ทั่วไป</SelectItem>
                <SelectItem value="BUSINESS">ผู้ประกอบการ</SelectItem>
                <SelectItem value="PENDING_BUSINESS">รอการอนุมัติ</SelectItem>
                <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="active">ใช้งานปกติ</SelectItem>
                <SelectItem value="pending">รอการอนุมัติ</SelectItem>
                <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchUsers} variant="outline">
              รีเฟรช
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            รายการผู้ใช้งาน ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ข้อมูลธุรกิจ</TableHead>
                  <TableHead>วันที่สมัคร</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleText(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.businessInfo ? (
                        <div>
                          <div className="font-medium">
                            {user.businessInfo.businessName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.businessInfo.businessType}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {user.role === "PENDING_BUSINESS" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => openApprovalModal(user, "approve")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openApprovalModal(user, "reject")}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดผู้ใช้</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">ข้อมูลส่วนตัว</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      ชื่อผู้ใช้
                    </label>
                    <p>{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      อีเมล
                    </label>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      โทรศัพท์
                    </label>
                    <p>{selectedUser.phone || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      ประเภทผู้ใช้
                    </label>
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {getRoleText(selectedUser.role)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              {selectedUser.businessInfo && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">ข้อมูลธุรกิจ</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        ชื่อธุรกิจ
                      </label>
                      <p>{selectedUser.businessInfo.businessName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        ประเภทธุรกิจ
                      </label>
                      <p>{selectedUser.businessInfo.businessType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        ที่อยู่ธุรกิจ
                      </label>
                      <p>{selectedUser.businessInfo.businessAddress}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        โทรศัพท์ธุรกิจ
                      </label>
                      <p>{selectedUser.businessInfo.businessPhone || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        รายละเอียดธุรกิจ
                      </label>
                      <p>
                        {selectedUser.businessInfo.businessDescription || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold mb-3">ข้อมูลเพิ่มเติม</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      วันที่สมัคร
                    </label>
                    <p>{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      อัปเดตล่าสุด
                    </label>
                    <p>{formatDate(selectedUser.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Modal */}
      <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "approve" ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              {actionType === "approve" ? "อนุมัติผู้ใช้" : "ปฏิเสธผู้ใช้"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "คุณต้องการอนุมัติให้ผู้ใช้นี้เป็นผู้ประกอบการหรือไม่?"
                : "คุณต้องการปฏิเสธคำขอของผู้ใช้นี้หรือไม่?"}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedUser.username}</h4>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                {selectedUser.businessInfo && (
                  <p className="text-sm text-gray-600">
                    {selectedUser.businessInfo.businessName}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApprovalModal(false)}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={() => handleUserAction(selectedUser?.id, actionType)}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {actionType === "approve" ? "อนุมัติ" : "ปฏิเสธ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
