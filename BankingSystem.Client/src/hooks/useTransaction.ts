import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";

export const useGetPaginatedTransactions = (
  pageNumber: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["transactions", pageNumber, pageSize],
    queryFn: async () =>
      transactionService.getPaginatedTransactions(pageNumber, pageSize),
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetUserTransactions = (
  userId: string,
  pageNumber: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["userTransactions", userId, pageNumber, pageSize],
    queryFn: () =>
      transactionService.getPaginatedTransactionsByUserId(
        userId,
        pageNumber,
        pageSize
      ),
    enabled: !!userId,
    placeholderData: (prev) => prev,
  });
};
