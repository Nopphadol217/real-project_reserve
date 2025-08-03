import axiosInstance from "@/utils/axiosInstance";

// Search places with filters
export const searchPlaces = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/search?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Search places error:", error);
    throw error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/search/categories");
    return response.data;
  } catch (error) {
    console.error("Get categories error:", error);
    throw error;
  }
};

// Get popular locations
export const getLocations = async () => {
  try {
    const response = await axiosInstance.get("/search/locations");
    return response.data;
  } catch (error) {
    console.error("Get locations error:", error);
    throw error;
  }
};
