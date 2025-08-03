import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import useBookingStore from "@/store/useBookingStore";
import useAuthStore from "@/store/useAuthStore";
import usePlaceStore from "@/store/usePlaceStore";
import { createBooking } from "@/api/bookingAPI";
import { checkRoomAvailability } from "@/api/availabilityAPI";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BookingConfirm = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const placeId = useBookingStore((state) => state.placeId);
  const { range, place, totalNights, selectedRoom } = useBookingStore();
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState } = useForm();
  const { isSubmitting } = formState;

  // State สำหรับตรวจสอบห้องว่าง
  const [availability, setAvailability] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  const checkIn = range?.from;
  const checkOut = range?.to;

  useEffect(() => {
    if (placeId) setValue("placeId", placeId);
    if (checkIn) setValue("checkIn", checkIn);
    if (checkOut) setValue("checkOut", checkOut);
  }, [range, place, setValue]);

  // ตรวจสอบห้องว่างเมื่อมีการเปลี่ยนแปลงวันที่
  useEffect(() => {
    const checkAvailability = async () => {
      if (checkIn && checkOut && placeId && user) {
        setIsCheckingAvailability(true);
        setAvailabilityError(null);
        
        try {
          const result = await checkRoomAvailability(
            placeId, 
            checkIn, 
            checkOut,
            selectedRoom?.id
          );
          setAvailability(result.data);
        } catch (error) {
          console.error('Error checking availability:', error);
          setAvailabilityError(error.message || 'ไม่สามารถตรวจสอบห้องว่างได้');
        } finally {
          setIsCheckingAvailability(false);
        }
      }
    };

    checkAvailability();
  }, [checkIn, checkOut, placeId, selectedRoom, user]);

  const handleBooking = async (value) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await createBooking(id,userId,value);
      console.log("Booking created:", res);
      // นำทางไปหน้า checkout พร้อมส่ง bookingId
      navigate(`/user/checkout/${res.result}`, {
        state: { bookingId: res.result },
      });
    } catch (error) {
      console.log("Booking error:", error);
    }
  };

  // If user is authenticated, show booking form
  if (user) {
    // แสดงสถานะการตรวจสอบห้องว่าง
    if (isCheckingAvailability) {
      return (
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-600">กำลังตรวจสอบห้องว่าง...</span>
          </div>
        </div>
      );
    }

    // แสดงข้อผิดพลาด
    if (availabilityError) {
      return (
        <div className="mt-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {availabilityError}
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full mt-2"
          >
            ลองใหม่อีกครั้ง
          </Button>
        </div>
      );
    }

    // แสดงสถานะห้องไม่ว่าง
    if (availability && !availability.isAvailable) {
      return (
        <div className="mt-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">ห้องไม่ว่างในช่วงวันที่เลือก</p>
                <p className="text-sm">
                  มีการจองทับซ้อนกับช่วงวันที่ {checkIn?.toLocaleDateString('th-TH')} - {checkOut?.toLocaleDateString('th-TH')}
                </p>
                {availability.availableCount > 0 && (
                  <p className="text-sm">
                    ห้องที่ว่างอยู่: {availability.availableCount} จาก {availability.totalRooms} ห้อง
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

    // แสดงฟอร์มจองเมื่อห้องว่าง
    if (availability && availability.isAvailable) {
      return (
        <div className="mt-4">
          {/* แสดงข้อมูลห้องว่าง */}
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-1">
                <p className="font-semibold">ห้องพร้อมให้บริการ!</p>
                <p className="text-sm">
                  ห้องว่างอยู่ {availability.availableCount} จาก {availability.totalRooms} ห้อง
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(handleBooking)} className="w-full">
            <Button
              type="submit"
              disabled={isSubmitting || !checkIn || !checkOut || !availability.isAvailable}
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
    }

    // แสดงข้อความรอตรวจสอบ
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="text-center">
          <p className="text-gray-600 mb-2">กรุณาเลือกช่วงวันที่เพื่อตรวจสอบห้องว่าง</p>
          <Button
            disabled
            variant="outline"
            className="w-full"
          >
            กรุณาเลือกวันที่
          </Button>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login button
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
};

export default BookingConfirm;
