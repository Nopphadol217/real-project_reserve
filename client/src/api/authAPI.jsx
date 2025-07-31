import api from "@/lib/api";
import axios from "axios";
axios.defaults.withCredentials = true; // ให้ browser แนบ cookie อัตโนมัติ

export const registerAPI = async (data) => {
  return await axios.post("http://localhost:5000/api/register", data, {
    withCredentials: true,
  });
};

export const loginAPI = async (data) => {
  return await axios.post(`${import.meta.env.VITE_API}/login`, data, {
    withCredentials: true,
  });
};

export const googleLoginAPI = async (payload) => {
  return await axios.post(
    `${import.meta.env.VITE_API}/auth/google-login`,
    payload,
    {
      withCredentials: true,
    }
  );
};

export const logoutAPI = async () => {
  return await api.post(`${import.meta.env.VITE_API}/logout`);
};

export const updateProfileAPI = async (data) => {
  return await api.put(`${import.meta.env.VITE_API}/profile/edit`, data);
};
