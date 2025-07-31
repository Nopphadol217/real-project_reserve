import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Bed } from "lucide-react";

const RoomManager = ({ value = [], onChange, errors = [] }) => {
  const [roomDetails, setRoomDetails] = useState(() => {
    return value.length > 0 ? value : [{ name: "", price: "" }];
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
      newRooms[index] = { ...newRooms[index], [field]: inputValue };
      return newRooms;
    });
  };

  const addRoom = () => {
    setRoomDetails((prev) => [...prev, { name: "", price: "" }]);
  };

  const removeRoom = (index) => {
    if (roomDetails.length > 1) {
      setRoomDetails((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bed className="w-5 h-5 text-red-500" />
          <Label className="text-sm font-medium text-gray-700">
            รายละเอียดห้อง
          </Label>
        </div>
        <Button
          type="button"
          onClick={addRoom}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มห้อง
        </Button>
      </div>

      <div className="space-y-4">
        {roomDetails.map((room, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50"
          >
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                ชื่อห้อง/รหัสห้อง
              </Label>
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

            <div className="flex items-end">
              {roomDetails.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeRoom(index)}
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-2 text-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors w-full justify-center"
                >
                  <Minus className="w-4 h-4" />
                  ลบห้อง
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* แสดงสรุปข้อมูล */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">ห้องทั้งหมด:</span> {roomDetails.length}{" "}
          ห้อง
        </p>
        <p className="text-xs text-gray-500 mt-1">
          กรุณากรอกชื่อห้องและราคาให้ครบถ้วนก่อนบันทึก
        </p>
      </div>
    </div>
  );
};

export default RoomManager;
