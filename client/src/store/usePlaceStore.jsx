import { listPlaces } from "@/api/createPlaceAPI";
import { create } from "zustand";

const placeStore = (set) => ({
  places: [],
  actionListPlace: async () => {
    try {
      const res = await listPlaces();
      // ตรวจสอบว่า response มีข้อมูลที่ถูกต้องหรือไม่
      const places = Array.isArray(res.data.result) ? res.data.result : [];
      set({ places });
    } catch (error) {
      console.log(error);
      // ถ้าเกิด error ให้ set เป็น array ว่าง
      set({ places: [] });
    }
  },
});

const usePlaceStore = create(placeStore);

export default usePlaceStore;
