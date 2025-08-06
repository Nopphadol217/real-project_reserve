import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useBookingStore from "@/store/useBookingStore";
import BookingConfirm from "./BookingConfirm";
import CheckoutButton from "./CheckoutButton";
import { useState } from "react";

function BookingForm({ onSubmit, showStripeOnly = false }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const price = useBookingStore((state) => state.price);
  const placeId = useBookingStore((state) => state.placeId);
  const range = useBookingStore((state) => state.range);
  const nights = useBookingStore((state) => state.nights);
  const selectedRoom = useBookingStore((state) => state.selectedRoom);
  const getTotalPrice = useBookingStore((state) => state.getTotalPrice);

  const checkIn = range?.from;
  const checkOut = range?.to;

  const formatNumber = (number) => {
    if (!number || isNaN(number)) return "0฿";
    return number.toLocaleString() + "฿";
  };

  // Use store's total price calculation with fallback
  const total = getTotalPrice() || 0;
  // Get current room price with fallback
  const roomPrice = selectedRoom?.price || price || 0;

  // Debug logging
  console.log("BookingForm Debug:", {
    selectedRoom,
    price,
    roomPrice,
    nights,
    total,
    range,
  });

  const handleShowPaymentOptions = () => {
    const bookingData = {
      placeId: placeId,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      totalPrice: total,
      price: roomPrice, // Use current room price
      nights: nights,
      placeTitle: "ชื่อที่พัก", // ควรได้มาจาก props หรือ store
      roomId: selectedRoom?.id,
      roomName: selectedRoom?.name,
    };

    // ส่งข้อมูลกลับไปยัง BookingContainer เพื่อแสดงหน้าเลือกการชำระเงิน
    if (!showStripeOnly) {
      onSubmit?.(bookingData);
    }
  };

  if (!range || !checkIn || !checkOut) {
    return (
      <div className="mt-4">
        <Card className="p-8">
          <div className="text-center text-gray-500">
            <p>กรุณาเลือกวันที่เข้าพักและออกก่อน</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full max-w-md">
      <Card className="p-6">
        <CardTitle className="mb-4">สรุปการจอง</CardTitle>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>ราคาต่อคืน</span>
            <span>{formatNumber(roomPrice)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>จำนวนคืน</span>
            <span>{nights} คืน</span>
          </div>

          {selectedRoom && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>ห้อง</span>
              <span>{selectedRoom.name}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>วันที่เข้าพัก</span>
            <span>{checkIn.toLocaleDateString("th-TH")}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>วันที่ออก</span>
            <span>{checkOut.toLocaleDateString("th-TH")}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-semibold text-lg">
            <span>ยอดรวม</span>
            <span className="text-green-600">{formatNumber(total)}</span>
          </div>
        </div>

        {showStripeOnly ? (
          // แสดงเฉพาะ BookingConfirm สำหรับ Stripe
          <div className="mt-6">
            {!showConfirm ? (
              <Button className="w-full" onClick={() => setShowConfirm(true)}>
                ดำเนินการชำระเงินผ่าน Stripe
              </Button>
            ) : (
              <div>
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirm(false)}
                  >
                    ← กลับ
                  </Button>
                </div>
                <BookingConfirm />
              </div>
            )}
          </div>
        ) : (
          // แสดงปุ่มปกติ
          <div className="space-y-3 mt-6">
            <Button className="w-full" onClick={() => setShowConfirm(true)}>
              ดำเนินการจอง
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleShowPaymentOptions}
            >
              เลือกวิธีการชำระเงิน
            </Button>

            {/* Alternative: Use CheckoutButton for direct payment */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3 text-center">
                หรือชำระเงินโดยตรง
              </p>
              <CheckoutButton
                onStripeCheckout={() => {
                  // Handle Stripe checkout
                  setShowConfirm(true);
                }}
                onBankTransferCheckout={() => {
                  // Handle bank transfer checkout
                  handleShowPaymentOptions();
                }}
              />
            </div>

            {showConfirm && (
              <div className="mt-6">
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfirm(false)}
                  >
                    ← กลับ
                  </Button>
                </div>
                <BookingConfirm />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default BookingForm;
