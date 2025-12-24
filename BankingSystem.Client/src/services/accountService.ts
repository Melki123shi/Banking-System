import { apiClient as api } from "@/lib/axios";
import type { Account } from "@/entities/account";

export const accountService = {
  createAccount: async (accountData: Partial<Account>): Promise<Account> => {
    const response = await api.post<Account>("/accounts", accountData);
    return response.data;
  },
  getAccountsByUserId: async (userId: string): Promise<Account[]> => {
    const response = await api.get<Account[]>(`/accounts/user/${userId}`);
    return response.data;
  },
  updateAccountStatus: async (
    accountId: string,
    status: "OPEN" | "CLOSED" | "FROZEN"
  ): Promise<Account> => {
    const response = await api.patch<Account>(`/accounts/${accountId}/status`, {
      status,
    });
    return response.data;
  },
};