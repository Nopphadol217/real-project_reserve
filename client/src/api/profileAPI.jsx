import api from "@/lib/api";
import axios from "axios";

export const profileAPI = async (token) => {
  return await api.get(`${process.env.VITE_API_URL}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const readUserAPI = async () =>{
  return await axios.get(`${process.env.VITE_API_URL}/api/manage-users`)
}
