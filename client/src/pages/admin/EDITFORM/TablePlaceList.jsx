import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import EditForm from "./EditForm"; // เราจะสร้างไฟล์นี้แยก
import usePlaceStore from "@/store/usePlaceStore";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deletePlace } from "@/api/createPlaceAPI";
import { toast } from "sonner";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  MapPin,
  Home,
  DollarSign,
  CreditCard,
} from "lucide-react";

const TableCellWithSeparator = ({ children, className = "" }) => (
  <TableCell className={`relative ${className}`}>
    {children}
    <Separator
      orientation="vertical"
      className="absolute right-0 top-0 h-full"
    />
  </TableCell>
);

function TablePlaceList() {
  //Zustand
  const places = usePlaceStore((state) => state.places);

  const hdlDelete = async (placeId, item) => {
    try {
      const res = await deletePlace(placeId, item);
      console.log(res);
      toast.message(res.data.message, {
        description: "คุณได้ลบข้อมูลสำเร็จเรียบร้อย",
      });
      // Refresh หน้าหลังลบสำเร็จ
      window.location.reload();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการลบ");
      console.error(error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount || 0);
  };

  const getStatusBadge = (isActive) => {
    return isActive !== false ? (
      <Badge className="bg-green-100 text-green-800">เปิดใช้งาน</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">ปิดใช้งาน</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              จัดการรายการที่พัก (Admin)
            </h1>
            <p className="text-gray-600">จัดการและตรวจสอบที่พักทั้งหมดในระบบ</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    ที่พักทั้งหมด
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {places.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    เปิดใช้งาน
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {places.filter((place) => place.isActive !== false).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    ราคาเฉลี่ย
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {places.length > 0
                      ? formatCurrency(
                          places.reduce(
                            (sum, place) => sum + (place.price || 0),
                            0
                          ) / places.length
                        )
                      : formatCurrency(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Places Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการที่พักทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            {places.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ที่พัก</TableHead>
                    <TableHead>เจ้าของ</TableHead>
                    <TableHead>ที่อยู่</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead>ห้องพัก</TableHead>
                    <TableHead>สิ่งอำนวยความสะดวก</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-center">การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {places.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                            {item.secure_url ? (
                              <img
                                src={item.secure_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">ID: {item.userId}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-sm">
                            {item.lat?.toFixed(4)}, {item.lng?.toFixed(4)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-sm text-gray-500">/คืน</span>
                      </TableCell>
                      <TableCell>
                        {/* Rooms Information */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {item.rooms || item.roomDetails?.length || 0} ห้อง
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>รายละเอียดห้องพัก</DialogTitle>
                              <DialogDescription>
                                ข้อมูลห้องพักทั้งหมด
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                              {item.roomDetails &&
                              item.roomDetails.length > 0 ? (
                                item.roomDetails.map((room, index) => (
                                  <div
                                    key={index}
                                    className="p-3 border rounded-lg"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h4 className="font-medium">
                                          {room.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          สถานะ:{" "}
                                          {room.status ? "ไม่ว่าง" : "ว่าง"}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-green-600">
                                          ฿{room.price?.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          ต่อคืน
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  ไม่มีข้อมูลห้องพัก
                                </div>
                              )}
                            </div>
                            <DialogClose asChild>
                              <Button className="w-full mt-4">ปิด</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        {/* Amenities Information */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {item.amenities?.length || 0} รายการ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>สิ่งอำนวยความสะดวก</DialogTitle>
                              <DialogDescription>
                                รายการสิ่งอำนวยความสะดวกทั้งหมด
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-2">
                              {item.amenities && item.amenities.length > 0 ? (
                                item.amenities.map((amenity, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 border rounded"
                                  >
                                    <span className="text-sm capitalize">
                                      {amenity}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-2 text-center py-4 text-gray-500">
                                  ไม่มีสิ่งอำนวยความสะดวก
                                </div>
                              )}
                            </div>
                            <DialogClose asChild>
                              <Button className="w-full mt-4">ปิด</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.isActive)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link to={`/place/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/manage-list/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/payment-settings/${item.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  คุณแน่ใจใช่ไหมว่าต้องการลบข้อมูลนี้?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                  ข้อมูลจะถูกลบออกจากระบบอย่างถาวร
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => hdlDelete(item.id, item)}
                                >
                                  ลบข้อมูล
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ยังไม่มีที่พัก
                </h3>
                <p className="text-gray-500 mb-6">ยังไม่มีที่พักในระบบ</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TablePlaceList;
