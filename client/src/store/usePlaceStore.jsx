import { listPlaces } from "@/api/createPlaceAPI";
import { create } from "zustand";

const placeStore = (set) => ({
  places: [],
  loading: false,
  error: null,
  
  listPlaces: async () => {
    try {
      set({ loading: true, error: null });
      const res = await listPlaces();
      set({ places: res.data.result || res.data || [], loading: false });
    } catch (error) {
      console.log('Error fetching places:', error);
      set({ error: 'ไม่สามารถโหลดข้อมูลที่พักได้', loading: false });
    }
  },
  
  actionListPlace: async () => {
    try {
      const res = await listPlaces();
      set({ places: res.data.result || res.data || [] });
    } catch (error) {
      console.log(error);
    }
  }
});

const usePlaceStore = create(placeStore);

export { usePlaceStore };
export default usePlaceStore;
