import { apiClient as api } from "@/lib/axios";
import type { User } from "@/entities/user";

export const userSerivce = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },
  createUser: async (
    userData: Pick<User, "name" | "phoneNumber" | "password">
  ): Promise<User> => {
    const response = await api.post<User>("/auth/signup", userData);
    return response.data;
  },
  getCurrentUser: async (token: string): Promise<User> => {
    const response = await api.get<User>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
