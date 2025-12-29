import { apiClient as api } from "@/lib/axios";
import type { User } from "@/entities/user";
import type { LoginRequest, LoginResponse } from "@/lib/types";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const payload = {
      phoneNumber: data.phoneNumber.trim(),
      password: data.password,
    };

    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/auth/logout", { refreshToken });
  },

  me: async (token: string): Promise<User> => {
    const response = await api.get<User>("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },
};
