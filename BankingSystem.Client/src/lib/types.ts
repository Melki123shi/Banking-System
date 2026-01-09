import type { User } from "@/entities/user";

export type TransactionStatus = "Completed" | "Failed" | "Pending";

export type TransactionType = "All" | "Deposit" | "Withdrawal" | "Transfer";

export interface UserTransactionDetail {
  transactionId: string;
  amount: number;
  date: string;
  counterpartyName: string;
  counterpartyAccountNumber: string;
  customerAccountNumber: string;
  transactionType: string;
  description?: string | null;
  completedAt: string;
  status: string;
  type: string;
}

export interface UserSummary {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  newUsersThisMonth: number;
}

export interface AccountSummary {
  totalAccounts: number;
  totalBalance: number;
  activeAccounts: number;
  activeBalance: number;
  inactiveAccounts: number;
  inactiveBalance: number;
}

export interface TransactionTypeSummary {
  totalTransactions: number;
  totalAmount: number;

  completedTransactions: number;
  completedAmount: number;

  failedTransactions: number;
  failedAmount: number;

  pendingTransactions: number;
  pendingAmount: number;
}

export interface TransactionSummaryDto {
  totalTransactions: number;
  totalAmount: number;

  completedTransactions: number;
  completedAmount: number;

  failedTransactions: number;
  failedAmount: number;

  pendingTransactions: number;
  pendingAmount: number;

  byType: Record<TransactionType, TransactionTypeSummary>;
}

export interface GetTransctionsSummaryRequest {
  types?: readonly TransactionType[]; // ✅ optional
  period?: "All" | "ThisWeek" | "ThisMonth" | "ThisYear" | "Custom";
  from?: string;
  to?: string;
}


export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface TransactionSearchParams {
  name?: string;
  accountNumber?: string;
  pageNumber: number;
  pageSize: number;
}

export interface UserSearchParams {
  phoneNumber?: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
}
