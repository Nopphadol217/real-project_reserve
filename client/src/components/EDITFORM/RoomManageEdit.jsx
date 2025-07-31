import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Bed } from "lucide-react";

const RoomManageEdit = ({
  value = [],
  onChange,
  errors = [],
  existingRooms = [], // ห้องที่มีอยู่แล้วในฐานข้อมูล
}) => {
  const [roomDetails, setRoomDetails] = useState(() => {
    // ถ้ามีห้องที่มีอยู่แล้ว ใช้ข้อมูลนั้น
    if (existingRooms && existingRooms.length > 0) {
      return existingRooms.map((room) => ({
        id: room.id, // เก็บ id สำหรับการอัปเดต
        name: room.name || "",
        price: room.price?.toString() || "",
        isExisting: true, // ทำเครื่องหมายว่าเป็นห้องที่มีอยู่แล้ว
      }));
    }

    return value.length > 0
      ? value
      : [{ name: "", price: "", isExisting: false }];
  });

  // Sync กับ parent component
  useEffect(() => {
    if (onChange) {
      onChange(roomDetails);
    }
  }, [roomDetails, onChange]);

  const handleRoomChange = (index, field, inputValue) => {
    setRoomDetails((prevRooms) => {
      const newRooms = [...prevRooms];
      newRooms[index] = {
        ...newRooms[index],
        [field]: inputValue,
        isModified: true, // ทำเครื่องหมายว่ามีการแก้ไข
      };
      return newRooms;
    });
  };

  const addRoom = () => {
    setRoomDetails((prev) => [
      ...prev,
      {
        name: "",
        price: "",
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
            จัดการรายละเอียดห้อง
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

      <div className="space-y-4">
        {roomDetails.map((room, index) => (
          <div
            key={room.id || index}
            className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg transition-all ${
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

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                สถานะ
              </Label>
              <div className="pt-2">
                {room.isExisting && room.id && (
                  <p className="text-xs text-gray-500">ID: {room.id}</p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  {room.isNew
                    ? "ห้องใหม่ที่จะสร้าง"
                    : room.isModified
                    ? "มีการแก้ไขข้อมูล"
                    : "ข้อมูลเดิมจากฐานข้อมูล"}
                </p>
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
            • ห้องใหม่: {roomDetails.filter((room) => room.isNew).length} ห้อง
          </p>
          <p>
            • ห้องที่แก้ไข:{" "}
            {
              roomDetails.filter((room) => room.isModified && room.isExisting)
                .length
            }{" "}
            ห้อง
          </p>
          <p>
            • ห้องเดิม:{" "}
            {
              roomDetails.filter((room) => room.isExisting && !room.isModified)
                .length
            }{" "}
            ห้อง
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomManageEdit;
