import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const apiClient = axios.create({
    baseURL: "http://localhost:5274/api",
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    // Get token directly from the store's state
    const token = useAuthStore.getState().accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (like 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      // Token expired or invalid - Clear store and redirect to login
      console.error("Unauthorized! Redirecting to login...");
      useAuthStore.getState().logout(); 
      
      // Optional: window.location.href = '/login';
    }

    // Extract backend error message if available
    const errorMessage = response?.data?.message || response?.data || error.message;
    return Promise.reject(errorMessage);
  }
);