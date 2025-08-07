import axios from "axios";

export const AddOrRemoveFavorite = async (userId, data) => {
  return await axios.post(`${import.meta.env.VITE_API}/favorites`, {
    userId,
    placeId: data.placeId,
    isFavorite: data.isFavorite,
  });
};

export const listFavorites = async (userId) => {
  return await axios.get(`${import.meta.env.VITE_API}/favorites/${userId}`);
};
