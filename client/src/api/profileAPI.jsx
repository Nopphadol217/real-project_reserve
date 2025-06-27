import api from "@/lib/api";
import axios from "axios";

export const profileAPI = async (token) => {
  return await api.get("http://localhost:5000/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const readUserAPI = async () =>{
  return await axios.get(`http://localhost:5000/api/manage-users`)
}
