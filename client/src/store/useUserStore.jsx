import { readUserAPI } from "@/api/profileAPI";
import { create } from "zustand";

const userStore = (set) => ({
  users: [],
  actionReadUser: async () => {
    try {
      const res = await readUserAPI();
 
      // ตรวจสอบว่า response มีข้อมูลที่ถูกต้องหรือไม่
      const users = Array.isArray(res.data.user) ? res.data.user : [];
      set({ users });
    } catch (error) {
      console.log(error);
      // ถ้าเกิด error ให้ set เป็น array ว่าง
      set({ users: [] });
    }
  },
});

const useUserStore = create(userStore);

export default useUserStore;
