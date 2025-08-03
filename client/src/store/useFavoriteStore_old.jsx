import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { listFavorites, actionFavorite, checkFavorite } from "../api/favoriteAPI";

const useFavoriteStore = create(
  devtools(
    (set, get) => ({
      // State
      favorites: [],
      favoriteIds: new Set(),
      loading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Action List Favorites
      actionListFavorite: async () => {
        try {
          set({ loading: true, error: null });
          const response = await listFavorites();
          
          if (response.success) {
            const favoriteIds = new Set(
              response.result.map(fav => fav.placeId)
            );
            
            set({
              favorites: response.result,
              favoriteIds,
              loading: false
            });
          }
        } catch (error) {
          console.error("Action list favorite error:", error);
          set({
            error: error.message || "ไม่สามารถโหลดรายการโปรดได้",
            loading: false
          });
        }
      },

      // Action Add or Remove Favorite
      actionAddOrRemoveFavorite: async (placeId, isFavorite) => {
        try {
          const response = await actionFavorite(placeId, isFavorite);
          
          if (response.success) {
            const currentFavorites = get().favorites;
            const currentFavoriteIds = get().favoriteIds;
            
            if (isFavorite) {
              // Remove favorite
              const updatedFavorites = currentFavorites.filter(
                item => item.Place.id !== placeId
              );
              const updatedFavoriteIds = new Set(currentFavoriteIds);
              updatedFavoriteIds.delete(placeId);
              
              set({
                favorites: updatedFavorites,
                favoriteIds: updatedFavoriteIds
              });
            } else {
              // Add favorite - need to fetch updated list
              await get().actionListFavorite();
            }
            
            return { success: true, message: response.message };
          }
        } catch (error) {
          console.error("Action add/remove favorite error:", error);
          const err = error?.message;
          return { success: false, message: err };
        }
      },

      // Check if place is favorite
      isFavorite: (placeId) => {
        return get().favoriteIds.has(placeId);
      },

      // Clear favorites (for logout)
      clearFavorites: () => {
        set({
          favorites: [],
          favoriteIds: new Set(),
          loading: false,
          error: null
        });
      },

      // Legacy methods for compatibility
      fetchFavorites: async () => {
        return await get().actionListFavorite();
      },

      toggleFavorite: async (placeId) => {
        const isFavorite = get().isFavorite(placeId);
        return await get().actionAddOrRemoveFavorite(placeId, isFavorite);
      },

      addToFavorites: async (placeId) => {
        return await get().actionAddOrRemoveFavorite(placeId, false);
      },

      removeFromFavorites: async (placeId) => {
        return await get().actionAddOrRemoveFavorite(placeId, true);
      }
    }),
    {
      name: "favorite-store"
    }
  )
);

export default useFavoriteStore;
