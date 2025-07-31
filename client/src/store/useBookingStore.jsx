import { create } from "zustand";

const useBookingStore = create((set) => ({
  // Date range selection
  range: {
    from: undefined,
    to: undefined,
  },

  // Current place being booked
  placeId: null,
  place: null,

  // Guest count
  guests: 1,

  // Booking calculation
  totalNights: 0,
  basePrice: 0,
  serviceFee: 0,
  totalPrice: 0,

  // Actions
  setRange: (range) => set({ range }),
  setPlace: (place) => set({ place, placeId: place?.id }),
  setGuests: (guests) => set({ guests }),

  // Calculate pricing
  calculatePricing: () =>
    set((state) => {
      if (!state.range?.from || !state.range?.to || !state.place?.price) {
        return {
          totalNights: 0,
          basePrice: 0,
          serviceFee: 0,
          totalPrice: 0,
        };
      }

      const checkIn = new Date(state.range.from);
      const checkOut = new Date(state.range.to);
      const totalNights = Math.ceil(
        (checkOut - checkIn) / (1000 * 60 * 60 * 24)
      );
      const basePrice = state.place.price;
      const subtotal = basePrice * totalNights;
      const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
      const totalPrice = subtotal + serviceFee;

      return {
        totalNights,
        basePrice,
        serviceFee,
        totalPrice,
      };
    }),

  // Reset booking data
  resetBooking: () =>
    set({
      range: { from: undefined, to: undefined },
      placeId: null,
      place: null,
      guests: 1,
      totalNights: 0,
      basePrice: 0,
      serviceFee: 0,
      totalPrice: 0,
    }),
}));

export default useBookingStore;
