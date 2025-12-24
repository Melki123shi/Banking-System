export interface Transaction {
    id?: string;
    senderAccountId: string;
    receiverAccountId: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    description: string;
    createdAt: Date;
}

