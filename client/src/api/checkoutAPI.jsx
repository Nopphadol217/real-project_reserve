import axios from "@/lib/api";

// Process automatic checkout for expired bookings
export const processAutomaticCheckoutAPI = async () => {
  return await axios.post("/booking/process-checkout");
};

// Manual checkout for specific booking
export const manualCheckoutAPI = async (bookingId) => {
  return await axios.put(`/booking/checkout/${bookingId}`);
};
