import type { Account } from "./account";

export interface Transaction {
    id?: string;
    transactionId: string;
    senderAccountId?: string;
    sender?: Account;
    receiverAccountId?: string;
    receiver?: Account;
    amount: number;
    type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Payment';
    status: 'Pending' | 'Completed' | 'Failed';
    description: string;
    createdAt: string;
    completedAt?: string;
}

