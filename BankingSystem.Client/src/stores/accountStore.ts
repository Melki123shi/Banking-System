import { create } from "zustand";
import type { Account } from "@/entities/account";

type AccountStatus = Account["status"];

type AccountState = {
  accounts: Account[];

  setAccounts: (accounts: Account[]) => void;
  createAccount: (account: Account) => void;

  updateAccountStatus: (
    accountId: string,
    status: AccountStatus
  ) => void;

  depositMoney: (accountId: string, amount: number) => void;
  withdrawMoney: (accountId: string, amount: number) => void;
};

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],

  setAccounts: (accounts) => set({ accounts }),

  createAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
    })),

  updateAccountStatus: (accountId, status) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId
          ? { ...account, status }
          : account
      ),
    })),

  depositMoney: (accountId, amount) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId
          ? { ...account, balance: account.balance + amount }
          : account
      ),
    })),

  withdrawMoney: (accountId, amount) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              balance: Math.max(0, account.balance - amount),
            }
          : account
      ),
    })),
}));
