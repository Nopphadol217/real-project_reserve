import { Calendar } from "@/components/ui/calendar";
import useBookingStore from "@/store/useBookingStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const defaultSelected = {
  from: undefined,
  to: undefined,
};

function BookingCalendar() {
  const [range, setRange] = useState(defaultSelected);
  const bookings = useBookingStore((state) => state.bookings);

  // สร้างรายการวันที่ถูกจองแล้ว
  const getDisabledDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const disabledDays = [
      // วันที่ผ่านมาแล้ว
      { before: today },
    ];

    // เพิ่มวันที่ถูกจองแล้ว
    if (bookings && Array.isArray(bookings)) {
      bookings.forEach((booking) => {
        if (booking.status === "confirmed" || booking.status === "pending") {
          const start = new Date(booking.checkIn);
          const end = new Date(booking.checkOut);

          // เพิ่มทุกวันในช่วงที่ถูกจองแล้ว
          for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            disabledDays.push(new Date(d));
          }
        }
      });
    }

    return disabledDays;
  };

  const handleSelect = (selectedRange) => {
    if (!selectedRange) {
      setRange(defaultSelected);
      return;
    }

    // ตรวจสอบว่าเลือกวันเดียวหรือช่วงวัน
    if (selectedRange.from && !selectedRange.to) {
      // เลือกวันแรกแล้ว แจ้งให้เลือกวันที่สอง
      setRange(selectedRange);
      toast.info("กรุณาเลือกวันที่ออก (Check-out)");
      return;
    }

    // ตรวจสอบว่าเลือกช่วงวันที่ถูกต้อง
    if (selectedRange.from && selectedRange.to) {
      const checkIn = new Date(selectedRange.from);
      const checkOut = new Date(selectedRange.to);

      // ตรวจสอบว่าต้องพักอย่างน้อย 1 คืน
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);

      if (daysDiff < 1) {
        toast.error("ต้องจองอย่างน้อย 1 คืน");
        setRange({ from: selectedRange.from, to: undefined });
        return;
      }

      // ตรวจสอบว่าไม่มีวันที่ถูกจองในช่วงที่เลือก
      const isConflict =
        bookings &&
        bookings.some((booking) => {
          if (booking.status !== "confirmed" && booking.status !== "pending")
            return false;

          const bookedStart = new Date(booking.checkIn);
          const bookedEnd = new Date(booking.checkOut);

          // ตรวจสอบการทับซ้อน
          return checkIn < bookedEnd && checkOut > bookedStart;
        });

      if (isConflict) {
        toast.error("มีการจองในช่วงวันที่เลือก กรุณาเลือกวันอื่น");
        setRange(defaultSelected);
        return;
      }

      // ถ้าทุกอย่างถูกต้อง
      setRange(selectedRange);
      toast.success(
        `เลือกวันที่เข้าพัก: ${checkIn.toLocaleDateString(
          "th-TH"
        )} - ${checkOut.toLocaleDateString("th-TH")}`
      );
    }
  };

  const calculateNights = () => {
    if (range.from && range.to) {
      const timeDiff = range.to.getTime() - range.from.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 0;
  };

  useEffect(() => {
  const store = useBookingStore.getState();

  if (range.from && range.to) {
    const formatDate = (date) => {
      return date.toISOString().split("T")[0]; // ได้ YYYY-MM-DD
    };

    store.setRange({
      from: formatDate(range.from),
      to: formatDate(range.to),
    });
  } else {
    store.setRange(range);
  }
}, [range]);


  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">เลือกวันที่เข้าพัก</h3>
        <p className="text-sm text-gray-600">
          เลือกวันเข้าพัก (Check-in) และวันออก (Check-out)
        </p>
        {range.from && range.to && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800">
              จำนวน {calculateNights()} คืน
            </p>
            <p className="text-xs text-blue-600">
              {range.from.toLocaleDateString("th-TH")} -{" "}
              {range.to.toLocaleDateString("th-TH")}
            </p>
          </div>
        )}
      </div>

      <Calendar
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={getDisabledDays()}
        className="rounded-md border"
        numberOfMonths={2}
        showOutsideDays={false}
      />

      <div className="text-xs text-gray-500 space-y-1">
        <p>• ไม่สามารถเลือกวันที่ผ่านมาแล้ว</p>
        <p>• วันที่ถูกจองแล้วจะแสดงเป็นสีเทา</p>
        <p>• ต้องจองอย่างน้อย 1 คืน</p>
      </div>
    </div>
  );
}

export default BookingCalendar;
