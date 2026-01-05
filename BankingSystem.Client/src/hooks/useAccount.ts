import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { Account } from "@/entities/account";
import { accountService } from "@/services/accountService";
import type { AxiosError } from "axios";

type ValidationErrorResponse = {
  title?: string;
  errors?: Record<string, string[]>;
};

export const useGetAccounts = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ["accounts", pageNumber, pageSize],
    queryFn: () => accountService.getPaginatedAccounts(pageNumber, pageSize),
    retry: false,
    placeholderData: (previousData) => previousData,
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

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      accountData,
    }: {
      accountId: string;
      accountData: Partial<Account>;
    }) => accountService.updateAccount(accountId, accountData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      message.success("Account updated successfully");
    },
    onError: () => {
      message.error("Failed to update account");
    },
  });
}

/* ----------------------------------------
   Deposit Money
----------------------------------------- */
export const useDepositMoney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      amount,
    }: {
      accountId: string;
      amount: number;
    }) => accountService.deposit(accountId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      amount,
      description
    }: {
      accountId: string;
      amount: number;
      description: string;
    }) => accountService.withdraw(accountId, amount, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["userTransactions"] });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fromAccountId,
      toAccountNumber,
      amount,
      description
    }: {
      fromAccountId: string;
      toAccountNumber: string;
      amount: number;
      description: string;
    }) =>
      accountService.transfer(fromAccountId, toAccountNumber, amount, description),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["userTransactions"] });
    },
    //! Error handling for validation errors

    onError: (error: AxiosError<ValidationErrorResponse>) => {
      const validationErrors = error.response?.data?.errors;

      // Grab the first validation error message
      validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;
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
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      message.error("Failed to delete account");
    },
  });
};

export const useUserAccounts = (userId: string) => {
  return useQuery<Account[]>({
    queryKey: ["accounts", userId],
    queryFn: () => accountService.getAccountsByUserId(userId),
    enabled: !!userId,
  });
};