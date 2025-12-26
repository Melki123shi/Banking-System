import { apiClient as api } from "@/lib/axios";
import type { User } from "@/entities/user";

const basePath = "/admin/users";

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export const userService = {
  // Matches [HttpGet] in AdminUsersController
  getPaginatedUsers: async (
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>(
      `${basePath}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Matches [HttpPost("register")]
  createUser: async (userData: any): Promise<User> => {
    const response = await api.post<User>(`${basePath}/register`, userData);
    return response.data;
  },

  // Matches [HttpPut("{id}")]
  updateUser: async (id: string, data: any) => {
    // console.log("called ....")
    const res = await api.put(`/admin/users/${id}`, data);
    // console.log(res);

  },
  // Matches [HttpDelete("{id}")]
  RemoveUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },
};
