import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  actionFavorite,
  listFavorites,
  checkFavorite,
} from "../api/favoriteAPI";

const useFavoriteStore = create(
  devtools(
    (set, get) => ({
      // State
      favorites: [],
      places: [],
      favoriteIds: new Set(),
      loading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Action Add or Remove Favorite (like the example)
      actionAddOrRemoveFavorite: async (placeId, isFavorite) => {
        try {
          set({ loading: true, error: null });
          const response = await actionFavorite(placeId, isFavorite);

          if (response.success) {
            // Update places list
            const places = get().places;
            const updatedPlaces = places.map((item) => {
              return item.id === placeId
                ? { ...item, isFavorite: !isFavorite }
                : item;
            });

            // Update favorites list
            const favorites = get().favorites;
            let updatedFavorites;

            if (isFavorite) {
              // Remove from favorites
              updatedFavorites = favorites.filter((item) => {
                return item.Place.id !== placeId;
              });
            } else {
              // Add to favorites - will need to refetch to get complete data
              await get().actionListFavorite();
              return { success: true, message: response.message };
            }

            const favoriteIds = new Set(
              updatedFavorites.map((fav) => fav.placeId)
            );

            set({
              places: updatedPlaces,
              favorites: updatedFavorites,
              favoriteIds,
              loading: false,
            });

            return { success: true, message: response.message };
          }
        } catch (error) {
          console.error("Action favorite error:", error);
          set({
            error: error.message || "ไม่สามารถจัดการรายการโปรดได้",
            loading: false,
          });
          return { success: false, message: error.message };
        }
      },

      // Action List Favorite (like the example)
      actionListFavorite: async () => {
        try {
          set({ loading: true, error: null });
          const response = await listFavorites();

          if (response.success) {
            const favoriteIds = new Set(
              response.result.map((fav) => fav.placeId)
            );

            set({
              favorites: response.result,
              favoriteIds,
              loading: false,
            });
          }
        } catch (error) {
          console.error("List favorites error:", error);
          set({
            error: error.message || "ไม่สามารถโหลดรายการโปรดได้",
            loading: false,
          });
        }
      },

      // Set places data (for use with filtering)
      setPlaces: (places) => {
        set({ places });
      },

      // Check if place is favorite
      isFavorite: (placeId) => {
        return get().favoriteIds.has(placeId);
      },

      // Clear favorites (for logout)
      clearFavorites: () => {
        set({
          favorites: [],
          places: [],
          favoriteIds: new Set(),
          loading: false,
          error: null,
        });
      },

      // Backward compatibility methods
      fetchFavorites: async () => await get().actionListFavorite(),
      toggleFavorite: async (placeId) => {
        const isFavorite = get().isFavorite(placeId);
        return await get().actionAddOrRemoveFavorite(placeId, isFavorite);
      },
    }),
    {
      name: "favorite-store",
    }
  )
);

export default useFavoriteStore;
