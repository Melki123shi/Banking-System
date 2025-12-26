import { apiClient as api } from "@/lib/axios";
import type { Account } from "@/entities/account";
import type { User } from "@/entities/user";
import { AxiosError } from "axios";

const basePath = "/admin/accounts";

type CreateAccountRequest = {
  accountNumber: string;
  userId: string;
  accountType: string;
  initialBalance: number;
};

export const accountService = {
  createAccount: async (accountData: Partial<Account>): Promise<Account> => {
    try {
      const response = await api.post<Account>(
        "/admin/accounts",
        accountData
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<any>;

      // Log backend validation errors
      console.error("Create account error:", err.response?.data);

      throw new Error(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create account"
      );
    }
  },
  getPaginatedAccounts: async (pageNumber: number, pageSize: number): Promise<Account[]> => {
    const response = await api.get<Account[]>(`${basePath}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  getUserByAccountId: async (accountId: string): Promise<User | null> => {
    const response = await api.get<User | null>(`${basePath}/${accountId}/user`);
    return response.data;
  },

  getPaginatedAccountsByUserId: async (userId: string, pageNumber: number, pageSize: number): Promise<Account[]> => {
    // console.log("................")
    const response = await api.get<Account[]>(`${basePath}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    // console.log(response);
    return response.data;
  },
  getAccountById: async (accountId: string): Promise<Account> => {
    const response = await api.get<Account>(`${basePath}/${accountId}`);
    return response.data;
  },
  deleteAccount: async (accountId: string): Promise<void> => {
    await api.delete(`${basePath}/${accountId}`);
  },
  withdraw: async (accountId: string, amount: number): Promise<Account> => {
    const response = await api.post<Account>(`${basePath}/${accountId}/withdraw`, {
      amount,
    });
    return response.data;
  },
  deposit: async (accountId: string, amount: number): Promise<Account> => {
    const response = await api.post<Account>(`${basePath}/${accountId}/deposit`, {
      amount,
    });
    return response.data;
  },
  transfer: async (
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ): Promise<void> => {
    await api.post(`${basePath}/${fromAccountId}/transfer`, {
      fromAccountId,
      toAccountId,
      amount,
    });
  },

  // updateAccountStatus: async (
  //   accountId: string,
  //   status: "Open" | "Closed" | "Frozen"
  // ): Promise<Account> => {
  //   const response = await api.patch<Account>(`/accounts/${accountId}/status`, {
  //     status,
  //   });
  //   return response.data;
  // },
};