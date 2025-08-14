import { listPlaces } from "@/api/createPlaceAPI";
import { AddOrRemoveFavorite, getUserFavorites } from "@/api/favoriteAPI";
import { create } from "zustand";

const placeStore = (set, get) => ({
  places: [],
  favorites: [],
  isLoading: false,
  error: null,

  actionListPlace: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await listPlaces(userId);
   

      // ตรวจสอบว่า response มีข้อมูลที่ถูกต้องหรือไม่
      const places = Array.isArray(res.data.result) ? res.data.result : [];
      const favoritesData = Array.isArray(res.data.favorites)
        ? res.data.favorites
        : [];

      // ใช้ข้อมูล isFavorite จาก backend ตรงๆ
      const placesWithFavorites = places.map((place) => {
        const favoritePlace = favoritesData.find((fav) => fav.id === place.id);
        return {
          ...place,
          isFavorite: favoritePlace ? favoritePlace.isFavorite : false,
        };
      });

      // อัปเดตข้อมูลไม่ว่าจะมี userId หรือไม่
      set({
        places: placesWithFavorites,
        favorites: favoritesData.filter((place) => place.isFavorite),
        isLoading: false,
      });
    } catch (error) {
      console.log("Error loading places:", error);
      // ถ้าเกิด error ให้ set เป็น array ว่าง
      set({
        places: [],
        favorites: [],
        isLoading: false,
        error: error.message,
      });
    }
  },

  actionFavoritePlace: async (token, data) => {
    try {
      const res = await AddOrRemoveFavorite(token, data);
      const places = get().places;
      const favorites = get().favorites;

      const { placeId, isFavorite } = data;

      // อัปเดต places ทั้งหมดใน store
      const updatedPlaces = places.map((place) => {
        return place.id === placeId
          ? { ...place, isFavorite: !isFavorite }
          : place;
      });

      set({ places: updatedPlaces });

      // อัปเดต favorites list
      if (isFavorite) {
        // ลบออกจาก favorites (กำลังจะลบ favorite)
        const updatedFavorites = favorites.filter((place) => {
          return place.id !== placeId;
        });
        set({ favorites: updatedFavorites });
      } else {
        // เพิ่มเข้า favorites (กำลังจะเพิ่ม favorite)
        const favoritePlace = places.find((place) => place.id === placeId);
        if (favoritePlace) {
          set({
            favorites: [...favorites, { ...favoritePlace, isFavorite: true }],
          });
        }
      }

      console.log("Favorite updated successfully:", res);
      return { success: true, message: res.message };
    } catch (error) {
      console.log("Error updating favorite:", error);
      const err = error?.response?.data?.message || error.message;
      set({ error: err });
      return { success: false, message: err };
    }
  },

  // โหลด favorites ของผู้ใช้
  actionLoadFavorites: async (token) => {
    try {
      set({ isLoading: true, error: null });
      const res = await getUserFavorites(token);
      console.log("Favorites response:", res);

      // ปรับปรุงข้อมูล favorites - ใช้ place object จาก response
      const favorites = Array.isArray(res.result)
        ? res.result.map((item) => ({
            ...item.place,
            isFavorite: true,
          }))
        : [];

      set({ favorites, isLoading: false });
      return res;
    } catch (error) {
      console.log("Error loading favorites:", error);
      set({ favorites: [], isLoading: false, error: error.message });
      throw error;
    }
  },

  // รีเฟรช favorites list
  actionListFavorite: async (token) => {
    try {
      const res = await getUserFavorites(token);
      const favorites = Array.isArray(res.result)
        ? res.result.map((item) => ({
            ...item.place,
            isFavorite: true,
          }))
        : [];
      set({ favorites });
      return favorites;
    } catch (error) {
      console.log("Error listing favorites:", error);
      return [];
    }
  },

  // เพิ่มฟังก์ชันสำหรับ clear error
  clearError: () => set({ error: null }),
});

const usePlaceStore = create(placeStore);

export default usePlaceStore;
