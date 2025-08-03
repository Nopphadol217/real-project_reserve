import { create } from "zustand";

const useBookingStore = create((set, get) => ({
  // State
  placeId: "",
  price: 0,
  bookings: [],
  range: undefined,
  place: null,
  selectedRoom: null,
  totalNights: 0,

  // Actions
  setPlaceId: (placeId) => set({ placeId }),
  setPrice: (price) => set({ price }),
  setBookings: (bookings) => set({ bookings }),
  setRange: (range) => {
    // คำนวณจำนวนคืนเมื่อเปลี่ยน range
    let totalNights = 0;
    if (range?.from && range?.to) {
      const timeDiff = range.to.getTime() - range.from.getTime();
      totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    set({ range, totalNights });
  },
  setPlace: (place) => set({ place }),
  setSelectedRoom: (selectedRoom) => set({ selectedRoom }),

  // Reset booking data
  resetBooking: () =>
    set({
      placeId: "",
      price: 0,
      bookings: [],
      range: undefined,
      place: null,
      selectedRoom: null,
      totalNights: 0,
    }),

  // Calculate total price
  getTotalPrice: () => {
    const { price, totalNights, selectedRoom } = get();
    const roomPrice = selectedRoom?.price || price;
    return roomPrice * totalNights;
  },
}));
export default useBookingStore;
