import { apiClient as api } from "@/lib/axios";
import type { Transaction } from "@/entities/transaction";
import type { PaginatedResponse, UserTransactionDetail } from "@/lib/types";

export const transactionService = {
  getPaginatedTransactions: async (
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<PaginatedResponse<Transaction>>(
      "/admin/transactions?pageNumber=" + pageNumber + "&pageSize=" + pageSize
    );
    return response.data;
  },
  getPaginatedTransactionsByUserId: async (
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedResponse<UserTransactionDetail>> => {
    const response = await api.get<PaginatedResponse<UserTransactionDetail>>(
      `/transactions/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    return response.data;
  },
};
