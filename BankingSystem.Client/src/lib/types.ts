import type { User } from "@/entities/user";

export interface UserTransactionDetail {
  transactionId: string;
  amount: number;
  date: string;
  direction: "IN" | "OUT";
  counterpartyName: string;
  counterpartyAccountNumber: string;
  customerAccountNumber: string;
  transactionType: string;
  description?: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
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
