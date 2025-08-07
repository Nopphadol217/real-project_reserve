import axios from "axios";

// Add or Remove Favorite
export const AddOrRemoveFavorite = async (token, data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/favorite`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in AddOrRemoveFavorite:", error);
    throw error;
  }
};

// Get User's Favorites
export const getUserFavorites = async (token) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getUserFavorites:", error);
    throw error;
  }
};
