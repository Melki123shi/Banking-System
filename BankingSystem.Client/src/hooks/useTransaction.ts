import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";

export const useGetPaginatedTransactions = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["transactions", pageNumber, pageSize],
    queryFn: async () => transactionService.getPaginatedTransactions(pageNumber, pageSize),
    retry: false,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
 
};

// export const useGetUserTransactions = (userId: string) => {
//   return useQuery({
//     queryKey: ["userTransactions", userId],
//     queryFn: async () => transactionService.getTransactionsByUserId(userId),
//     enabled: !!userId,
//     staleTime: 1000 * 60 * 5,
//   });
// };
