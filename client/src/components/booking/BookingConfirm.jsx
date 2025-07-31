import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useBookingStore from "@/store/useBookingStore";
import useAuthStore from "@/store/useAuthStore";

const BookingConfirm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { range, place, totalNights } = useBookingStore();

  const { register, handleSubmit, setValue, formState } = useForm();
  const { isSubmitting } = formState;

  const checkIn = range?.from;
  const checkOut = range?.to;
  const placeId = place?.id;

  useEffect(() => {
    if (placeId) setValue("placeId", placeId);
    if (checkIn) setValue("checkIn", checkIn);
    if (checkOut) setValue("checkOut", checkOut);
  }, [range, place, setValue]);

  const handleBooking = async (value) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Simulate booking creation API call
      // const res = await createBooking(token, value);
      // const bookingId = res.data.result;

      // For now, simulate with random ID
      const bookingId = Date.now();
      console.log("Booking created:", value);

      // Navigate to checkout page
      navigate(`/user/checkout/${bookingId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // If user is authenticated, show booking form
  if (user) {
    return (
      <div className="flex items-center justify-center mt-4">
        <form onSubmit={handleSubmit(handleBooking)} className="w-full">
          <Button
            type="submit"
            disabled={isSubmitting || !checkIn || !checkOut}
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
