import { apiClient as api } from "@/lib/axios";
import type { User } from "@/entities/user";
import type {
  PaginatedResponse,
  UpdateUserRequest,
  UserSearchParams,
  UserSummary,
} from "@/lib/types";

const basePath = "admin/users";

export const userService = {
  getPaginatedUsers: async (
    phoneNumber: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedResponse<User>> => {
    console.log(phoneNumber);
    const response = await api.get<PaginatedResponse<User>>(
      `${basePath}?pageNumber=${pageNumber}&pageSize=${pageSize}${
        phoneNumber
          ? `&phoneNumber=${encodeURIComponent(phoneNumber)}`
          : ""
      }`
    );
    console.log(response.data, "response data");
    return response.data;
  },
  getDetails: async (id: string): Promise<User> => {
    const response = await api.get<User>(`${basePath}/${id}`);
    return response.data;
  },

  createUser: async (userData: any): Promise<User> => {
    const response = await api.post<User>(`${basePath}/register`, userData);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserRequest) => {
    await api.put(`${basePath}/${id}`, data);
  },

  RemoveUser: async (id: string) => {
    await api.delete(`${basePath}/${id}`);
  },
  GetSummary: async (): Promise<UserSummary> => {
    const response = await api.get<UserSummary>(`${basePath}/summary`);
    return response.data;
  },
};
