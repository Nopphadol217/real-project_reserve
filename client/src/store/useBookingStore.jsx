import { create } from "zustand";

const bookingStore = () => ({
  placeId: "",
  price: 0,
  bookings: [],
  range: undefined,
});

const useBookingStore = create(bookingStore);
export default useBookingStore

