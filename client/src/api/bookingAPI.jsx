import api from "@/utils/axiosInstance";
import axios from "axios";

// Create booking
export const createBooking = async (placeId, userId, data) => {
  try {
    const response = await axios.post("http://localhost:5000/api/booking", {
      placeId: placeId,
      userId: userId,
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create booking for bank transfer
export const createBookingAPI = async (bookingData) => {
  try {
    const response = await api.post("/booking/bank-transfer", bookingData);
    return response;
  } catch (error) {
    throw error;
  }
};

// List user bookings
export const listBookings = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/bookings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Checkout payment
export const checkout = async (bookingId) => {
  try {
    const response = await axios.post("http://localhost:5000/api/checkout", {
      id: bookingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check payment status
export const checkOutStatus = async (sessionId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/checkout-status/${sessionId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.put(`/booking/cancel/${bookingId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
