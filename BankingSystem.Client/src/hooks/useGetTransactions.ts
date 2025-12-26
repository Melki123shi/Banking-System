import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import type { Transaction } from "@/entities/transaction";

export const useGetTransactions = (
  pageNumber: number,
  pageSize: number
) => {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", pageNumber, pageSize],
    queryFn: () =>
      transactionService.getPaginatedTransactions(
        pageNumber,
        pageSize
      ),
    placeholderData: (prev) => prev,
  });
};
