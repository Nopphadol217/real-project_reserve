import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import useBookingStore from "@/store/useBookingStore";
import useAuthStore from "@/store/useAuthStore";
import usePlaceStore from "@/store/usePlaceStore";
import { createBooking } from "@/api/bookingAPI";
import { readPlace } from "@/api/createPlaceAPI";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BookingConfirm = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const placeId = useBookingStore((state) => state.placeId);
  const { range, place, totalNights, selectedRoom, setPlace, setSelectedRoom } =
    useBookingStore();
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState } = useForm();
  const { isSubmitting } = formState;

  const [isLoading, setIsLoading] = useState(false);

  const checkIn = range?.from;
  const checkOut = range?.to;

  // Debug ข้อมูล
  console.log("BookingConfirm Debug:", {
    selectedRoom,
    place: place?.title,
    placeId,
    user: user?.id,
    checkIn: checkIn?.toDateString(),
    checkOut: checkOut?.toDateString(),
    roomDetails: place?.roomDetails?.map((room) => ({
      name: room.name,
      status: room.status,
      available: room.status === 0,
    })),
  });

  useEffect(() => {
    if (placeId) setValue("placeId", placeId);
    if (checkIn) setValue("checkIn", checkIn);
    if (checkOut) setValue("checkOut", checkOut);
  }, [range, place, setValue]);

  // Clear selected room เมื่อเปลี่ยนวันที่เพื่อให้เลือกห้องใหม่
  useEffect(() => {
    if (checkIn && checkOut && setSelectedRoom) {
      console.log("Date changed, clearing selected room");
      setSelectedRoom(null);
    }
  }, [checkIn, checkOut, setSelectedRoom]);

  // โหลดข้อมูล place ใหม่ทุกครั้งเมื่อมีการเปลี่ยนแปลงวันที่
  useEffect(() => {
    const fetchPlace = async () => {
      if (placeId) {
        setIsLoading(true);
        try {
          console.log("Fetching latest place data for ID:", placeId);
          const response = await readPlace(placeId);
          console.log("Latest place data fetched:", response.data.result);

          // อัปเดตข้อมูล place ใหม่
          setPlace(response.data.result);

          // Log room statuses for debugging
          if (response.data.result.roomDetails) {
            console.log(
              "Room statuses:",
              response.data.result.roomDetails.map((room) => ({
                name: room.name,
                status: room.status,
                available: room.status === 0 || room.status === false,
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching place:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPlace();
  }, [placeId, checkIn, checkOut, setPlace]); // เพิ่ม checkIn, checkOut เป็น dependencies

  const handleBooking = async (value) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await createBooking(id, userId, value);
      console.log("Booking created:", res);
      // นำทางไปหน้า checkout พร้อมส่ง bookingId
      navigate(`/user/checkout/${res.result}`, {
        state: { bookingId: res.result },
      });
    } catch (error) {
      console.log("Booking error:", error);
    }
  };

  // ตรวจสอบสถานะห้องว่าง - status 0 = ว่าง, status 1 = ไม่ว่าง
  const isRoomAvailable = () => {
    console.log("=== Checking room availability ===");

    // ถ้ามี selectedRoom ใช้ข้อมูลนั้น
    if (selectedRoom) {
      const isAvailable =
        selectedRoom.status === 0 || selectedRoom.status === false;
      console.log("Using selectedRoom:", {
        name: selectedRoom.name,
        status: selectedRoom.status,
        available: isAvailable,
      });
      return isAvailable;
    }

    // ถ้าไม่มี selectedRoom แต่มี place และ roomDetails
    if (place && place.roomDetails && place.roomDetails.length > 0) {
      console.log(
        "Checking place.roomDetails:",
        place.roomDetails.map((room) => ({
          name: room.name,
          status: room.status,
          available: room.status === 0 || room.status === false,
        }))
      );

      // หาห้องที่ว่าง (status = 0 หรือ false)
      const availableRooms = place.roomDetails.filter(
        (room) => room.status === 0 || room.status === false
      );
      console.log("Available rooms count:", availableRooms.length);
      return availableRooms.length > 0;
    }

    console.log("No room data available");
    return false;
  };

  // ใช้ห้องที่ถูกเลือกหรือห้องแรกที่ว่าง
  const getCurrentRoom = () => {
    if (selectedRoom) {
      console.log("Using selectedRoom:", selectedRoom);
      return selectedRoom;
    }

    if (place && place.roomDetails && place.roomDetails.length > 0) {
      // หาห้องแรกที่ว่าง (status = 0 หรือ false)
      const availableRoom = place.roomDetails.find(
        (room) => room.status === 0 || room.status === false
      );
      const chosenRoom = availableRoom || place.roomDetails[0];
      console.log("Using room from place:", {
        name: chosenRoom.name,
        status: chosenRoom.status,
        available: chosenRoom.status === 0 || chosenRoom.status === false,
      });
      return chosenRoom;
    }

    console.log("No room found");
    return null;
  };

  const currentRoom = getCurrentRoom();
  const canBook =
    user && checkIn && checkOut && currentRoom && isRoomAvailable();

  // แสดง loading เมื่อกำลังโหลดข้อมูล place
  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-gray-600">กำลังโหลดข้อมูลที่พัก...</span>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่ได้เข้าสู่ระบบ
  if (!user) {
    return (
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => navigate("/auth")}
          variant="destructive"
          className="w-full"
        >
          กรุณาเข้าสู่ระบบก่อนจอง
        </Button>
      </div>
    );
  }

  // ถ้ายังไม่เลือกวันที่
  if (!checkIn || !checkOut) {
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="text-center">
          <p className="text-gray-600 mb-2">กรุณาเลือกช่วงวันที่เพื่อจอง</p>
          <Button disabled variant="outline" className="w-full">
            กรุณาเลือกวันที่
          </Button>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่เลือกห้อง
  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {place ? "ไม่พบห้องที่พร้อมใช้งาน" : "ไม่พบข้อมูลที่พัก"}
          </p>
          <Button
            onClick={() => navigate(`/place/${placeId}`)}
            variant="outline"
            className="w-full"
          >
            {place ? "กลับไปดูรายละเอียดที่พัก" : "ดูข้อมูลที่พัก"}
          </Button>
        </div>
      </div>
    );
  }

  // แสดงผลตามสถานะห้อง
  if (canBook) {
    // ห้องว่าง - แสดงปุ่มจอง
    return (
      <div className="mt-4">
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="space-y-1">
              <p className="font-semibold">ห้องพร้อมให้บริการ!</p>
              <p className="text-sm">
                ห้อง: {currentRoom.name} (
                {currentRoom.price ? `${currentRoom.price} บาท/คืน` : ""})
              </p>
              <p className="text-xs">
                วันที่: {checkIn?.toLocaleDateString("th-TH")} -{" "}
                {checkOut?.toLocaleDateString("th-TH")} ({totalNights} คืน)
              </p>
              <p className="text-xs text-green-600">
                สถานะห้อง:{" "}
                {currentRoom.status === 0 || currentRoom.status === false
                  ? "ว่าง (พร้อมจอง)"
                  : "ไม่ว่าง"}
                {selectedRoom ? " (เลือกโดยผู้ใช้)" : " (เลือกอัตโนมัติ)"}
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(handleBooking)} className="w-full">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                กำลังจอง...
              </div>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                ยืนยันการจอง
              </>
            )}
          </Button>
        </form>
      </div>
    );
  } else {
    // ห้องไม่ว่าง - แสดงข้อความและปุ่มกลับ
    return (
      <div className="mt-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">ห้องไม่ว่าง</p>
              <p className="text-sm">ห้อง {currentRoom.name} ไม่ว่างในขณะนี้</p>
              <p className="text-xs">
                วันที่: {checkIn?.toLocaleDateString("th-TH")} -{" "}
                {checkOut?.toLocaleDateString("th-TH")} ({totalNights} คืน)
              </p>
              <p className="text-xs">
                สถานะห้อง:{" "}
                {currentRoom.status === 1 || currentRoom.status === true
                  ? "ถูกจองแล้ว"
                  : "ไม่ทราบสถานะ"}
              </p>
              {place?.roomDetails && place.roomDetails.length > 1 && (
                <p className="text-xs">
                  ห้องทั้งหมด: {place.roomDetails.length} ห้อง | ห้องว่าง:{" "}
                  {
                    place.roomDetails.filter(
                      (room) => room.status === 0 || room.status === false
                    ).length
                  }{" "}
                  ห้อง
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
        <div className="flex gap-2 mt-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1"
          >
            เลือกวันที่ใหม่
          </Button>
          <Button
            onClick={() => navigate(`/place/${placeId}`)}
            variant="default"
            className="flex-1"
          >
            ดูห้องอื่น
          </Button>
        </div>
      </div>
    );
  }
};

export default BookingConfirm;
