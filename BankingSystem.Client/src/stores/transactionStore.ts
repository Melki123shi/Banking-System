import { create } from "zustand";
import type { Transaction } from "@/entities/transaction";

type TransactionState = {
  transactions: Transaction[] | [];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  getUserTransactions: (userId: string) => Transaction[];
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],

  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  addTransaction: (transaction: Transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  getUserTransactions: (userId: string) => {
    return get().transactions.filter(
      (transaction) =>
        transaction.senderAccountId === userId ||
        transaction.receiverAccountId === userId
    );
  },
}));
