import api from "@/lib/api";
import axios from "axios";

export const profileAPI = async (token) => {
  return await api.get(`${import.meta.env.VITE_API}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const readUserAPI = async () =>{
  return await axios.get(`${import.meta.env.VITE_API}/manage-users`)
}
