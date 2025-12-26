import type { User } from "./user";

export interface Account {
    id: string;
    userId: string;
    user?: User;
    userName: string;
    accountNumber: string;
    type: 'Checking' | 'Savings' | 'Credit' | 'Business';
    balance: number;
    status: 'Active'| 'Inactive' | 'Closed' | 'Frozen';
    createdAt: string;
    updatedAt?: string;
}