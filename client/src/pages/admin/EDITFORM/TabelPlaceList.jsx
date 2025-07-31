import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

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
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deletePlace } from "@/api/createPlaceAPI";
import { toast } from "sonner";

const TableCellWithSeparator = ({ children, className = "" }) => (
  <TableCell className={`relative ${className}`}>
    {children}
    <Separator
      orientation="vertical"
      className="absolute right-0 top-0 h-full"
    />
  </TableCell>
);

function TabelPlaceList() {
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

  return (
    <div className="">
      <Card className="p-4">
        <h1 className="text-2xl mb-4">จัดการรายการที่พัก</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="relative w-[50px]">
                ID
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[100px]">
                Title (ชื่อ)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[75px]">
                Price (ราคา)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[75px]">
                Rooms (ห้อง)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[100px]">
                Amenities (สิ่งอำนวยความสะดวก)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[200px] text-center">
                Description (รายละเอียด)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[175px] text-center">
                Category (ประเภท)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[175px]">
                Location (ตำแหน่ง)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[175px] text-center">
                Image (รูปภาพหลัก)
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[175px] text-center">
                Gallery
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="relative w-[175px] text-center">
                แก้ไขข้อมูล
                <Separator
                  orientation="vertical"
                  className="absolute right-0 top-0 h-full"
                />
              </TableHead>
              <TableHead className="text-center">ลบข้อมูล</TableHead>
            </TableRow>
          </TableHeader>
          <TableCaption>A list of your recent invoices.</TableCaption>
          {places.map((item, index) => {
            return (
              <TableBody key={index}>
                <TableRow>
                  <TableCellWithSeparator className="font-medium">
                    {item.id}
                  </TableCellWithSeparator>
                  <TableCellWithSeparator>{item.title}</TableCellWithSeparator>
                  <TableCellWithSeparator>
                    {item.price} ฿
                  </TableCellWithSeparator>

                  {/* Rooms Information */}
                  <TableCellWithSeparator className="text-center">
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
                          {item.roomDetails && item.roomDetails.length > 0 ? (
                            item.roomDetails.map((room, index) => (
                              <div
                                key={index}
                                className="p-3 border rounded-lg"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{room.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      สถานะ: {room.status ? "ไม่ว่าง" : "ว่าง"}
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
                  </TableCellWithSeparator>

                  {/* Amenities Information */}
                  <TableCellWithSeparator className="text-center">
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
                  </TableCellWithSeparator>

                  <TableCellWithSeparator className="text-center">
                    <Dialog>
                      <DialogTrigger>Open</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>รายละเอียด</DialogTitle>
                          <DialogDescription>
                            <Textarea value={item.description} readOnly />
                          </DialogDescription>
                          <DialogClose asChild>
                            <Button>ปิด</Button>
                          </DialogClose>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCellWithSeparator>

                  <TableCellWithSeparator className="capitalize text-center">
                    {item.category}
                  </TableCellWithSeparator>
                  <TableCellWithSeparator className="capitalize ">
                    {item.lat.toFixed(4)},{item.lng.toFixed(4)}
                  </TableCellWithSeparator>

                  <TableCellWithSeparator className="text-center">
                    <Dialog>
                      <DialogTrigger>Open</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>รายละเอียด</DialogTitle>
                          <DialogDescription>รูปภาพหลัก</DialogDescription>
                          {item.secure_url ? (
                            <img
                              src={item.secure_url}
                              alt={item.public_id}
                              className="aspect-video rounded-xl object-cover"
                            />
                          ) : (
                            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
                              Image Not Found
                            </div>
                          )}
                          <DialogClose asChild>
                            <Button>ปิด</Button>
                          </DialogClose>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCellWithSeparator>

                  <TableCellWithSeparator className="text-center">
                    <Dialog>
                      <DialogTrigger>Open</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>รายละเอียด</DialogTitle>
                          <DialogDescription>รูปภาพหลัก</DialogDescription>
                          {item.galleries.length > 0 ? (
                            <div className="flex gap-2">
                              <ScrollArea className="h-[500px] w-[450px]   rounded-md border">
                                {item.galleries.map((gallery, index) => (
                                  <div className="p-4" key={index}>
                                    <h4 className="">Tags</h4>
                                    <img
                                      src={gallery.secure_url}
                                      alt={gallery.public_id}
                                      className="w-full object-cover rounded"
                                    />
                                  </div>
                                ))}
                              </ScrollArea>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No images
                            </span>
                          )}
                          <DialogClose asChild>
                            <Button>ปิด</Button>
                          </DialogClose>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCellWithSeparator>

                  <TableCellWithSeparator className="text-center">
                    <Button>
                      <Link to={`/admin/manage-list/${item.id}`}>แก้ไข</Link>
                    </Button>
                  </TableCellWithSeparator>
                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">ลบข้อมูล</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            คุณแน่ใจใช่ไหมว่าต้องการลบข้อมูลนี้?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>{" "}
                          <AlertDialogAction
                            className="bg-red-500"
                            onClick={() => hdlDelete(item.id, item)}
                          >
                            ลบข้อมูล
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

export default TabelPlaceList;
