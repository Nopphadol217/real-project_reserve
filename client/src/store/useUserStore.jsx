import { readUserAPI } from "@/api/profileAPI";
import { create } from "zustand";


const userStore = (set) => ({
    users:[],
    actionReadUser: async () =>{
        try {
            const res = await readUserAPI()
            set({users:res.data.user})
        } catch (error) {
            console.log(error)
        }
    }
})


const useUserStore = create(userStore)


export default useUserStore