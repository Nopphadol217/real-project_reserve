
import { profileAPI } from "@/api/profileAPI";
import { create } from "zustand";

const useAuth = (set) => ({
  user: null,
  isHydrated: false,

  // เก็บจาก login res.data.user
  setUser: (user) => {
    set({ user });
  },

  // เก็บจาก login res.data.token
  clearAuth: () => {
    set({ user: null, isHydrated: true });
  },

  hydrate: async () => {
    try {
      const res = await profileAPI(); // จะใช้ axiosInstance ด้านล่าง
     
      set({ user: res.data.result, isHydrated: true });
    } catch {
        set({ user: null, isHydrated: true });
      
    }
  },
});

const useAuthStore = create(useAuth);

export default useAuthStore;
