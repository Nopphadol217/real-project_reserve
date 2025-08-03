import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Bed, CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

const RoomManageEdit = ({
  value = [],
  onChange,
  errors = [],
  existingRooms = [], // ห้องที่มีอยู่แล้วในฐานข้อมูล
}) => {
  const [roomDetails, setRoomDetails] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize roomDetails เมื่อ existingRooms มีการเปลี่ยนแปลง
  useEffect(() => {
    console.log("RoomManageEdit useEffect triggered:", {
      existingRooms,
      isInitialized,
    });

    if (existingRooms && existingRooms.length > 0 && !isInitialized) {
      const initialRooms = existingRooms.map((room) => ({
        id: room.id, // เก็บ id สำหรับการอัปเดต
        name: room.name || "",
        price: room.price?.toString() || "",
        status: room.status || false, // เพิ่มสถานะห้อง
        isExisting: true, // ทำเครื่องหมายว่าเป็นห้องที่มีอยู่แล้ว
      }));

      console.log("Setting initial rooms:", initialRooms);
      setRoomDetails(initialRooms);
      setIsInitialized(true);

      // Sync กับ parent ทันที
      if (onChange) {
        onChange(initialRooms);
      }
    } else if (roomDetails.length === 0 && !isInitialized) {
      // ถ้าไม่มีข้อมูลเลย ให้สร้างห้องเปล่า 1 ห้อง
      const defaultRoom = [
        { name: "", price: "", status: false, isExisting: false },
      ];
      console.log("Setting default room:", defaultRoom);
      setRoomDetails(defaultRoom);
      setIsInitialized(true);
    }
  }, [existingRooms, isInitialized, onChange]);

  // Sync กับ parent component เฉพาะเมื่อ roomDetails เปลี่ยน (แต่ไม่ใช่ตอน initialize)
  useEffect(() => {
    if (onChange && roomDetails.length > 0 && isInitialized) {
      console.log("Syncing with parent:", roomDetails);
      onChange(roomDetails);
    }
  }, [roomDetails]);

  const handleRoomChange = async (index, field, inputValue) => {
    console.log(
      `Room change: index=${index}, field=${field}, value=${inputValue}`
    );

    setRoomDetails((prevRooms) => {
      const newRooms = [...prevRooms];
      const currentRoom = newRooms[index];
      const previousStatus = currentRoom.status;

      newRooms[index] = {
        ...currentRoom,
        [field]: inputValue,
        isModified: true, // ทำเครื่องหมายว่ามีการแก้ไข
      };

      // หากเปลี่ยนสถานะจาก occupied (true) เป็น available (false)
      if (
        field === "status" &&
        previousStatus === true &&
        inputValue === false
      ) {
        console.log(
          "Status changed from occupied to available, clearing bookings..."
        );
        handleClearBookingsForRoom(currentRoom.id);
      }

      return newRooms;
    });
  };

  const handleClearBookingsForRoom = async (roomId) => {
    if (!roomId) {
      console.log("No room ID provided for clearing bookings");
      return;
    }

    try {
      console.log(`Clearing bookings for room ${roomId}...`);
      const response = await axiosInstance.delete(
        `/booking/clear-room/${roomId}`
      );
      console.log("Bookings cleared successfully:", response.data);

      // แสดงผลสำเร็จ (อาจจะใช้ toast notification)
      alert(`ลบการจองสำเร็จ: ${response.data.message}`);
    } catch (error) {
      console.error("Error clearing bookings:", error);
      alert("เกิดข้อผิดพลาดในการลบการจอง");
    }
  };

  const addRoom = () => {
    setRoomDetails((prev) => [
      ...prev,
      {
        name: "",
        price: "",
        status: false, // เริ่มต้นเป็นว่าง
        isExisting: false, // ห้องใหม่
        isNew: true,
      },
    ]);
  };

  const removeRoom = (index) => {
    setRoomDetails((prev) => {
      if (prev.length > 1) {
        const roomToRemove = prev[index];
        const newRooms = prev.filter((_, i) => i !== index);

        // ถ้าเป็นห้องที่มีอยู่แล้ว ทำเครื่องหมายว่าจะลบ
        if (roomToRemove.isExisting && roomToRemove.id) {
          // เพิ่มลงใน list ห้องที่จะลบ
          const roomsToDelete = newRooms.filter((room) => room.toDelete);
          roomsToDelete.push({ ...roomToRemove, toDelete: true });
        }

        return newRooms;
      }
      return prev;
    });
  };

  const getRoomStatusBadge = (room) => {
    if (room.isNew) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          ใหม่
        </span>
      );
    }
    if (room.isModified && room.isExisting) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
          แก้ไข
        </span>
      );
    }
    if (room.isExisting) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          มีอยู่แล้ว
        </span>
      );
    }
    return null;
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bed className="w-5 h-5 text-red-500" />
          <Label className="text-sm font-medium text-gray-700">
            จัดการรายละเอียดห้อง ({roomDetails.length} ห้อง)
          </Label>
        </div>
        <Button
          type="button"
          onClick={addRoom}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มห้องใหม่
        </Button>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <strong>Debug Info:</strong>
          <br />
          Rooms count: {roomDetails.length}
          <br />
          Initialized: {isInitialized.toString()}
          <br />
          Existing rooms: {existingRooms?.length || 0}
        </div>
      )}

      {roomDetails.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bed className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>ไม่มีข้อมูลห้อง กำลังโหลด...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {roomDetails.map((room, index) => (
              <div
                key={room.id || index}
                className={`grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg transition-all ${
                  room.isNew
                    ? "bg-green-50 border-green-200"
                    : room.isModified
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      ชื่อห้อง/รหัสห้อง
                    </Label>
                    {getRoomStatusBadge(room)}
                  </div>
                  <Input
                    type="text"
                    placeholder="เช่น ห้องดีลักซ์ หรือ A101"
                    value={room.name || ""}
                    onChange={(e) =>
                      handleRoomChange(index, "name", e.target.value)
                    }
                    className={`w-full ${
                      errors[index]?.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[index].name}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    ราคาต่อคืน (บาท)
                  </Label>
                  <Input
                    type="number"
                    placeholder="เช่น 1500"
                    value={room.price || ""}
                    onChange={(e) =>
                      handleRoomChange(index, "price", e.target.value)
                    }
                    className={`w-full ${
                      errors[index]?.price ? "border-red-500" : ""
                    }`}
                    min="0"
                  />
                  {errors[index]?.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[index].price}
                    </p>
                  )}
                </div>

                {/* สถานะห้อง (ว่าง/ไม่ว่าง) */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    สถานะห้อง
                  </Label>
                  <Select
                    value={room.status ? "true" : "false"}
                    onValueChange={(value) =>
                      handleRoomChange(index, "status", value === "true")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>ว่าง</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>ไม่ว่าง</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ข้อมูลสถานะและการจัดการ */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    ข้อมูล
                  </Label>
                  <div className="pt-2 space-y-2">
                    {room.isExisting && room.id && (
                      <p className="text-xs text-gray-500">ID: {room.id}</p>
                    )}
                    <p className="text-xs text-gray-600">
                      {room.isNew
                        ? "ห้องใหม่ที่จะสร้าง"
                        : room.isModified
                        ? "มีการแก้ไขข้อมูล"
                        : "ข้อมูลเดิมจากฐานข้อมูล"}
                    </p>

                    {/* แสดงสถานะห้องปัจจุบัน */}
                    <div className="flex items-center gap-1">
                      {room.status ? (
                        <>
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span className="text-xs text-red-600">ไม่ว่าง</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">ว่าง</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  {roomDetails.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeRoom(index)}
                      variant="outline"
                      className="flex items-center gap-2 px-3 py-2 text-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors w-full justify-center"
                    >
                      <Minus className="w-4 h-4" />
                      {room.isExisting ? "ลบห้อง" : "เอาออก"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* สรุปการเปลี่ยนแปลง */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              สรุปการเปลี่ยนแปลง:
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• ห้องทั้งหมด: {roomDetails.length} ห้อง</p>
              <p>
                • ห้องใหม่: {roomDetails.filter((room) => room.isNew).length}{" "}
                ห้อง
              </p>
              <p>
                • ห้องที่แก้ไข:{" "}
                {
                  roomDetails.filter(
                    (room) => room.isModified && room.isExisting
                  ).length
                }{" "}
                ห้อง
              </p>
              <p>
                • ห้องเดิม:{" "}
                {
                  roomDetails.filter(
                    (room) => room.isExisting && !room.isModified
                  ).length
                }{" "}
                ห้อง
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomManageEdit;
