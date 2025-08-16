import api from "@/lib/api";
import axios from "axios";
axios.defaults.withCredentials = true; // ให้ browser แนบ cookie อัตโนมัติ

export const registerAPI = async (data) => {
  return await axios.post("https://real-project-reserve.onrender.com/api/register", data, {
    withCredentials: true,
  });
};

export const businessRegisterAPI = async (data) => {
  return await axios.post("https://real-project-reserve.onrender.com/api/business-register", data, {
    withCredentials: true,
  });
};

export const loginAPI = async (data) => {
  return await axios.post(`https://real-project-reserve.onrender.com/api/login`, data, {
    withCredentials: true,
  });
};

export const googleLoginAPI = async (payload) => {
  return await axios.post(
    `https://real-project-reserve.onrender.com/api/auth/google-login`,
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
