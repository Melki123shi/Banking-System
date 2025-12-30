import type { User } from "./user";

export interface Account {
    id: string;
    userId: string;
    user?: User;
    userName: string;
    accountNumber: string;
    type: 'checking' | 'savings' | 'credit' | 'business';
    balance: number;
    status: 'active'| 'inactive' | 'closed' | 'frozen';
    createdAt: string;
    updatedAt?: string;
}