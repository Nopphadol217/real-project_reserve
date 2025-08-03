import axiosInstance from '@/utils/axiosInstance';

// ตรวจสอบห้องว่าง
export const checkRoomAvailability = async (placeId, checkIn, checkOut, roomId = null) => {
  try {
    const params = new URLSearchParams({
      placeId: placeId.toString(),
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0]
    });

    if (roomId) {
      params.append('roomId', roomId.toString());
    }

    const response = await axiosInstance.get(`/availability/check?${params}`);
    return response.data;
  } catch (error) {
    console.error('Check room availability error:', error);
    throw error.response?.data || error;
  }
};

// ตรวจสอบห้องว่างทั้งหมด
export const checkAllRoomsAvailability = async (placeId, checkIn, checkOut) => {
  try {
    const params = new URLSearchParams({
      placeId: placeId.toString(),
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0]
    });

    const response = await axiosInstance.get(`/availability/rooms?${params}`);
    return response.data;
  } catch (error) {
    console.error('Check all rooms availability error:', error);
    throw error.response?.data || error;
  }
};
