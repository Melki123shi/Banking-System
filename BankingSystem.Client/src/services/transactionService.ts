import { apiClient as api } from "@/lib/axios";
import type { Transaction } from "@/entities/transaction";
import type { PaginatedResponse, TransactionSearchParams, UserTransactionDetail } from "@/lib/types";

const buildParams = (params: TransactionSearchParams) => new URLSearchParams({
  ...(params.name && { name: params.name }),
  ...(params.accountNumber && { accountNumber: params.accountNumber }),
  pageNumber: params.pageNumber.toString(),
  pageSize: params.pageSize.toString(),
}).toString();

export const transactionService = {
  getTransactions: async (params: TransactionSearchParams) => {
    const response = await api.get<PaginatedResponse<Transaction>>(`admin/transactions?${buildParams(params)}`);
    return response.data;
  },
  getUserTransactions: async (userId : string, params: TransactionSearchParams) => {
    const response = await api.get<PaginatedResponse<UserTransactionDetail>>(`transactions/${userId}?${buildParams(params)}`);
    return response.data;
  }
};