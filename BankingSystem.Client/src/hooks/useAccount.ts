import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import type { Account } from "@/entities/account";
import { accountService } from "@/services/accountService";
import { useAccountStore } from "@/stores/accountStore";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export const useGetAccounts = () => {
    const setAccounts = useAccountStore((s) => s.setAccounts);

    const query = useQuery<Account[]>({
        queryKey: ["accounts"],
        queryFn: accountService.getAccounts,
    });

    /* ✅ handle side effects here */
    useEffect(() => {
        if (query.isSuccess) {
            setAccounts(query.data);
        }

        if (query.isError) {
            message.error("Failed to fetch accounts");
        }
    }, [query.isSuccess, query.isError, query.data, setAccounts]);

    

    return query;
}



/* ----------------------------------------
   Get Accounts By User ID
----------------------------------------- */
export const useGetAccountsByUserId = (userId?: string) => {
  return useQuery<Account[]>({
    queryKey: ["accounts", userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return accountService.getAccountsByUserId(userId);
    },
    enabled: !!userId,
  });
};

/* ----------------------------------------
   Get Account By ID
----------------------------------------- */
export const useGetAccountById = (accountId?: string) => {
  return useQuery({
    queryKey: ["account", accountId],
    queryFn: () => {
      if (!accountId) throw new Error("Account ID required");
      return accountService.getAccountById(accountId);
    },
    enabled: !!accountId,
  });
};

/* ----------------------------------------
   Create Account
----------------------------------------- */
export const useCreateAccount = () => {
  const createAccount = useAccountStore((s) => s.createAccount);
  const user = useUserStore((s) => s.selectedUser);

  return useMutation({
    mutationFn: (payload: Partial<Account>) =>
      accountService.createAccount(payload),

    onSuccess: (account) => {
      createAccount(account);
      message.success("Account created successfully");
    },

    onError: () => {
      message.error("Failed to create account");
    },
  });
};

/* ----------------------------------------
   Deposit Money
----------------------------------------- */
export const useDepositMoney = () => {
  const updateAccount = useAccountStore((s) => s.updateAccountStatus);
  const depositMoney = useAccountStore((s) => s.depositMoney);

  return useMutation({
    mutationFn: ({
      accountId,
      amount,
    }: {
      accountId: string;
      amount: number;
    }) => accountService.deposit(accountId, amount),

    onSuccess: (updatedAccount) => {
      depositMoney(updatedAccount.id, updatedAccount.balance);
      message.success("Deposit successful");
    },

    onError: () => {
      message.error("Deposit failed");
    },
  });
};

/* ----------------------------------------
   Withdraw Money
----------------------------------------- */
export const useWithdrawMoney = () => {
  const withdrawMoney = useAccountStore((s) => s.withdrawMoney);

  return useMutation({
    mutationFn: ({
      accountId,
      amount,
    }: {
      accountId: string;
      amount: number;
    }) => accountService.withdraw(accountId, amount),

    onSuccess: (updatedAccount) => {
      withdrawMoney(updatedAccount.id, updatedAccount.balance);
      message.success("Withdrawal successful");
    },

    onError: () => {
      message.error("Withdrawal failed");
    },
  });
};

/* ----------------------------------------
   Transfer Money
----------------------------------------- */
export const useTransferMoney = () => {
  return useMutation({
    mutationFn: ({
      fromAccountId,
      toAccountId,
      amount,
    }: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
    }) =>
      accountService.transfer(fromAccountId, toAccountId, amount),

    onSuccess: () => {
      message.success("Transfer completed");
    },

    onError: () => {
      message.error("Transfer failed");
    },
  });
};

/* ----------------------------------------
   Delete Account
----------------------------------------- */
export const useDeleteAccount = () => {
  const setAccounts = useAccountStore((s) => s.setAccounts);
  const accounts = useAccountStore((s) => s.accounts);

  return useMutation({
    mutationFn: (accountId: string) =>
      accountService.deleteAccount(accountId),

    onSuccess: (_, accountId) => {
      setAccounts(accounts.filter((a) => a.id !== accountId));
      message.success("Account deleted");
    },

    onError: () => {
      message.error("Failed to delete account");
    },
  });
};
