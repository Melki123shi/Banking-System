import { apiClient as api } from "@/lib/axios";
import type { Transaction } from "@/entities/transaction";

export const transactionService = {
  getPaginatedTransactions: async (pageNumber: number, pageSize: number ): Promise<Transaction[]> => {
        const response = await api.get<Transaction[]>("/admin/transactions?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
    return response.data;
  },
  getTransactionsByUserId: async (userId: string): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(
      `/transactions/user/${userId}`
    );
    return response.data;
  },
};
