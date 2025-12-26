import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { Account } from "@/entities/account";
import { accountService } from "@/services/accountService";

export const useGetAccounts = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["accounts", pageNumber, pageSize],
    queryFn: () => accountService.getPaginatedAccounts(pageNumber, pageSize),
    retry: false,
    placeholderData: (previousData) => previousData,
  });
};

/* ----------------------------------------
   Get Accounts By User ID
----------------------------------------- */
export const useGetAccountsByUserId = (
  userId?: string,
  pageNumber?: number,
  pageSize?: number
) => {
  // console.log("debuggin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");  console.log(userId, pageNumber, pageSize)
;  return useQuery<Account[]>({
    queryKey: ["accounts", userId, pageNumber, pageSize],
    queryFn: () => {
      // console.log("called")
      if (!userId) return Promise.resolve([]);
      // console.log("Fetching accounts for user:", userId, "with pageNumber:", pageNumber, "and pageSize:", pageSize);
      return accountService.getPaginatedAccountsByUserId(
        userId,
        pageNumber!,
        pageSize!
      );
    },
    enabled: !!userId && pageNumber !== undefined && pageSize !== undefined,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountService.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

/* ----------------------------------------
   Deposit Money
----------------------------------------- */
export const useDepositMoney = () => {
  return useMutation({
    mutationFn: ({
      accountId,
      amount,
    }: {
      accountId: string;
      amount: number;
    }) => accountService.deposit(accountId, amount),
    onSuccess: () => {
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
  return useMutation({
    mutationFn: ({
      accountId,
      amount,
    }: {
      accountId: string;
      amount: number;
    }) => accountService.withdraw(accountId, amount),
    onSuccess: () => {
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
    }) => accountService.transfer(fromAccountId, toAccountId, amount),

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => accountService.deleteAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      message.error("Failed to delete account");
    },
  });
};
