import { apiClient as api } from "@/lib/axios";
import type { User } from "@/entities/user";


export const authService = {
  login: async (loginData: Pick<User, "phoneNumber" | "password">): Promise<string> => {
    const response = await api.post<{token: string}>("/auth/login", { loginData });
    return response.data.token;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
