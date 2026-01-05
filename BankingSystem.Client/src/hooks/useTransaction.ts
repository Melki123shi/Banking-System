import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";

export const useTransactions = (params: {
  name?: string;
  accountNumber?: string;
  pageNumber: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionService.getTransactions(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserTransactions = (
  userId: string,
  params: {
    name?: string;
    accountNumber?: string;
    pageNumber: number;
    pageSize: number;
  }
) => {
  return useQuery({
    queryKey: ["userTransactions", params, userId],
    queryFn: () => transactionService.getUserTransactions(userId, params),
    staleTime: 1000 * 60 * 5,
  });
};
