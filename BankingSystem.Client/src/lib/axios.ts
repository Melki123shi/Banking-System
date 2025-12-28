import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const apiClient = axios.create({
    baseURL: "http://localhost:5274/api",
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
  if (!config.url?.includes("/auth/login")) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

