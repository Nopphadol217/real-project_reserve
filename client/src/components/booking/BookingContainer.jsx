import { useEffect } from "react";
import BookingCalendar from "./BookingCalendar";
import BookingForm from "./BookingForm";
import useBookingStore from "@/store/useBookingStore";

function BookingContainer({ placeId, price, bookings }) {
  useEffect(() => {
    useBookingStore.setState({
      placeId: placeId,
      price: price,
      bookings: bookings,
    });
  }, [placeId]);

  return (
    <div className="flex flex-col mb-8">
      <BookingCalendar />
      <BookingForm />
    </div>
  );
}

export default BookingContainer;
