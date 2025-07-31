import { Calendar } from "@/components/ui/calendar";
import useBookingStore from "@/store/useBookingStore";
import { useEffect, useState } from "react";

const defaultSelected = {
  from: undefined,
  to: undefined,
};

function BookingCalendar() {
  const [range, setRange] = useState(defaultSelected);

  useEffect(() => {
    // เป็นการ setState เข้าไปใน useBookingStore ที่เราตั้งไว้
    useBookingStore.setState({
      range: range,
    });
  }, [range]);

  return (
    <div>
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        className="rounded-md border"
      />
    </div>
  );
}
export default BookingCalendar;
