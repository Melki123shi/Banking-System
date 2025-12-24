import { apiClient as api } from "@/lib/axios";
import type { Transaction } from "@/entities/transaction";

export const transactionService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>("/transactions");
    return response.data;
  },
  createTransaction: async (
    transactionData: Partial<Transaction>
  ): Promise<Transaction> => {
    const response = await api.post<Transaction>(
      "/transactions",
      transactionData
    );
    return response.data;
  },
  getTransactionsByUserId: async (userId: string): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(
      `/transactions/user/${userId}`
    );
    return response.data;
  },
};
