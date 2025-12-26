import { useTransactionStore } from "@/stores/transactionStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { useEffect } from "react";

export const useGetPaginatedTransactions = (pageNumber: number, pageSize: number) => {
  const setTransactions = useTransactionStore((state) => state.setTransactions);

  const query = useQuery({
    queryKey: ["transactions", pageNumber, pageSize],
    queryFn: async () => transactionService.getPaginatedTransactions(pageNumber, pageSize),
    staleTime: 1000 * 60 * 5,
  });
  useEffect(() => {
    if (query.data) {
      setTransactions(query.data);
    }
  }, [query.data, setTransactions]);
  return query;
};

// export const useCreateTransaction = () => {
//   const addTransaction = useTransactionStore((state) => state.addTransaction);

//   return useMutation({
//     mutationFn: transactionService.createTransaction,
//     onSuccess: (transaction) => {
//       addTransaction(transaction);
//     },
//   });
// };

// export const useGetUserTransactions = (userId: string) => {
//   return useQuery({
//     queryKey: ["userTransactions", userId],
//     queryFn: async () => transactionService.getTransactionsByUserId(userId),
//     enabled: !!userId,
//     staleTime: 1000 * 60 * 5,
//   });
// };
