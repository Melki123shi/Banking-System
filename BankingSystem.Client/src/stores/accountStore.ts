import { create } from "zustand";
import type { Account } from "@/entities/account";

type AccountState = {
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
};

export const useAccountStore = create<AccountState>((set) => ({
  selectedAccount: null,

  setSelectedAccount: (account) => set({ selectedAccount: account }),

}));
