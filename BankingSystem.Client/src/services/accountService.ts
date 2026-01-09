import { apiClient as api } from "@/lib/axios";
import type { Account } from "@/entities/account";
import type { User } from "@/entities/user";
import { AxiosError } from "axios";
import type { AccountSummary, PaginatedResponse } from "@/lib/types";

const basePath = "admin/accounts";

export const accountService = {
  createAccount: async (accountData: Partial<Account>): Promise<Account> => {
    try {
      const response = await api.post<Account>(`${basePath}`, accountData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<any>;

      throw new Error(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to create account"
      );
    }
  },
  getPaginatedAccounts: async (
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedResponse<Account>> => {
    const response = await api.get<PaginatedResponse<Account>>(
      `${basePath}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  getUserByAccountId: async (accountId: string): Promise<User | null> => {
    const response = await api.get<User | null>(
      `${basePath}/${accountId}/user`
    );
    return response.data;
  },

  getAccountsByUserId: async (
    userId: string
  ): Promise<Account[]> => {
    const response = await api.get<Account[]>(
      `accounts/${userId}`
    );
    return response.data;
  },
  getAccountById: async (accountId: string): Promise<Account> => {
    const response = await api.get<Account>(`${basePath}/${accountId}`);
    return response.data;
  },
  updateAccount: async (accountId: string, accountData: Partial<Account>): Promise<Account> => {
    const response = await api.put<Account>(`${basePath}/${accountId}`, accountData);
    return response.data;
  },
  deleteAccount: async (accountId: string): Promise<void> => {
    await api.delete(`${basePath}/${accountId}`);
  },
  getAccountSummary: async (): Promise<AccountSummary> => {
    const response = await api.get<AccountSummary>(`${basePath}/summary`);
    return response.data;
  },
  withdraw: async (accountId: string, amount: number, description: string): Promise<Account> => {
    const response = await api.post<Account>(
      `${basePath}/${accountId}/withdraw`,
      {
        amount,
        description
      }
    );
    return response.data;
  },
  deposit: async (accountId: string, amount: number): Promise<Account> => {
    const response = await api.post<Account>(
      `${basePath}/${accountId}/deposit`,
      {
        amount,
      }
    );
    return response.data;
  },
  transfer: async (
    accountId: string,
    receiverAccountNumber: string,
    amount: number,
    description: string
  ): Promise<void> => {
    try {
      const res = await api.post(`${basePath}/${accountId}/transfer`, {
        accountId,
        receiverAccountNumber,
        amount,
        description,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
