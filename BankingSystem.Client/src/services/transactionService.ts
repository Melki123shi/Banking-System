import { apiClient as api } from "@/lib/axios";
import type { Transaction } from "@/entities/transaction";

export const transactionService = {
  getPaginatedTransactions: async (pageNumber: number, pageSize: number ): Promise<Transaction[]> => {
        const response = await api.get<Transaction[]>("/admin/transactions?pageNumber=" + pageNumber + "&pageSize=" + pageSize);
    return response.data;
  },
  getPaginatedTransactionsByUserId: async (userId: string, pageNumber: number, pageSize: number): Promise<Transaction[]> => {
    console.log("tranaction .... ", userId, pageNumber, pageSize);
    const response = await api.get<Transaction[]>(
      `/transactions/${userId}?pageNumber=` + pageNumber + "&pageSize=" + pageSize
    );
    console.log("response data ", response, response.data);
    return response.data;
  },
};
