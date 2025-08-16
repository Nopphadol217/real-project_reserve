import api from "@/lib/api";
import axios from "axios";

export const profileAPI = async (token) => {
  return await axios.get(`$https://real-project-reserve.onrender.com/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const readUserAPI = async () =>{
  return await axios.get(`https://real-project-reserve.onrender.com/api/manage-users`)
}
