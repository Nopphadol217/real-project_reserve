import { listPlaces } from "@/api/createPlaceAPI";
import { create } from "zustand";



const placeStore = (set) => ({
  places: [],
  actionListPlace: async () =>{
    try {
        const res = await listPlaces()

        set({places:res.data.result})
    } catch (error) {
        console.log(error)
    }
  }
});

const usePlaceStore = create(placeStore)

export default usePlaceStore
