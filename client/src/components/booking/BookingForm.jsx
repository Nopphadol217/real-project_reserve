import { Card, CardTitle } from "@/components/ui/card";
import useBookingStore from "@/store/useBookingStore";
import BookingConfirm from "./BookingConfirm";

function BookingForm() {
  const price = useBookingStore((state) => state.price);
  const range = useBookingStore((state) => state.range);
  const checkIn = range?.from;
  const checkOut = range?.to;

  // คำนวณจำนวนคืน
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const formatNumber = (number) => {
    return number?.toLocaleString() + "฿";
  };

  // คำนวณราคารวม
  const totalNights = calculateNights(checkIn, checkOut);
  const total = price * totalNights;

  if (!range || !checkIn || !checkOut) return null;

  return (
    <div className="mt-2 ">
      <Card className="p-8">
        <CardTitle>สรุป</CardTitle>
        <p className="flex justify-between mt-2">
          <span className="items-center">{`${price}฿ x ${totalNights} คืน`}</span>
          <span>{formatNumber(total)}</span>
        </p>
      </Card>
      <BookingConfirm />
    </div>
  );
}

export default BookingForm;
