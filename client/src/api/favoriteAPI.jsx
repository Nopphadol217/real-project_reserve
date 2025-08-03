import axiosInstance from "../utils/axiosInstance";

// Action Favorite (Add or Remove)
export const actionFavorite = async (placeId, isFavorite) => {
  try {
    const response = await axiosInstance.post("/api/favorite/action", {
      placeId: placeId,
      isFavorite: isFavorite,
    });
    return response.data;
  } catch (error) {
    console.error("Action favorite error:", error);
    throw error.response?.data || error;
  }
};

// ดูรายการโปรดทั้งหมด
export const listFavorites = async () => {
  try {
    const response = await axiosInstance.get("/api/favorite/list");
    return response.data;
  } catch (error) {
    console.error("List favorites error:", error);
    throw error.response?.data || error;
  }
};

// ตรวจสอบสถานะรายการโปรด
export const checkFavorite = async (placeId) => {
  try {
    const response = await axiosInstance.get(`/api/favorite/check/${placeId}`);
    return response.data;
  } catch (error) {
    console.error("Check favorite error:", error);
    throw error.response?.data || error;
  }
};
