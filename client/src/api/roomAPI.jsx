import axiosInstance from "../utils/axiosInstance";

// Get room availability for specific dates
export const getRoomAvailability = async (placeId, checkIn, checkOut) => {
  try {
    const response = await axiosInstance.get(
      `/api/room/availability/${placeId}`,
      {
        params: { checkIn, checkOut },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get room availability error:", error);
    throw error.response?.data || error;
  }
};

// Get all room statuses for a place
export const getAllRoomStatuses = async (placeId) => {
  try {
    const response = await axiosInstance.get(`/api/room/status/${placeId}`);
    return response.data;
  } catch (error) {
    console.error("Get room statuses error:", error);
    throw error.response?.data || error;
  }
};

// Check if room is available
export const checkRoomAvailability = async (
  placeId,
  roomId,
  checkIn,
  checkOut
) => {
  try {
    const response = await getRoomAvailability(placeId, checkIn, checkOut);

    if (response.success) {
      const room = response.place.roomDetails.find((r) => r.id === roomId);
      return {
        success: true,
        isAvailable: room?.isAvailable || false,
        room: room,
      };
    }

    return { success: false, isAvailable: false };
  } catch (error) {
    console.error("Check room availability error:", error);
    return { success: false, isAvailable: false, error: error.message };
  }
};
