import { create } from "zustand";
import type { Account } from "@/entities/account";

type AccountState = {
  accounts: Account[] | [];
  createAccount: (account: Account) => void;
  updateAccountStatus: (
    accountId: string,
    status: "OPEN" | "CLOSED" | "FROZEN"
  ) => void;
  depositMoney: (userId: string, amount: number) => void;
  withdrawMoney: (userId: string, amount: number) => void;
};

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  createAccount: (account: Account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),
  updateAccountStatus: (
    accountId: string,
    status: "OPEN" | "CLOSED" | "FROZEN"
  ) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId ? { ...account, status } : account
      ),
    })),
  depositMoney: (userId: string, amount: number) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.userId === userId
          ? { ...account, balance: account.balance + amount }
          : account
      ),
    })),
  withdrawMoney(userId, amount) {
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.userId === userId
          ? { ...account, balance: account.balance - amount }
          : account
      ),
    }));
  },
}));
