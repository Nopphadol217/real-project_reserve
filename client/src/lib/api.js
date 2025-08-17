// lib/axiosInstance.js
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";

const api = axios.create({

  baseURL: `${import.meta.env.VITE_API}`,

  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/refresh");  // ขอ token ใหม่
        return api(originalRequest); // ยิง request เดิมซ้ำ
      } catch (err) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }

);

export default api;