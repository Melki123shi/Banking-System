import { apiClient as api } from "@/lib/axios";
import type { Account } from "@/entities/account";
import type { User } from "@/entities/user";
import { AxiosError } from "axios";

const basePath = "/admin/accounts";

export const accountService = {
  createAccount: async (accountData: Partial<Account>): Promise<Account> => {
    try {
      const response = await api.post<Account>("/admin/accounts", accountData);
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
  ): Promise<Account[]> => {
    const response = await api.get<Account[]>(
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

  getPaginatedAccountsByUserId: async (
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Promise<Account[]> => {
    const response = await api.get<Account[]>(
      `${basePath}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
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
    const response = await api.post<Account>(
      `${basePath}/${accountId}/withdraw`,
      {
        amount,
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
    console.log(accountId, receiverAccountNumber, amount, description)
    try {
      const res = await api.post(`${basePath}/${accountId}/transfer`, {
        accountId,
        receiverAccountNumber,
        amount,
        description,
      });
      console.log("res", res)
    } catch (error) {
      throw error;
    }
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
