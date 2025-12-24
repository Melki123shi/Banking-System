export interface Account {
    id: string;
    userId: string;
    accountNumber: string;
    accountType: 'Checking' | 'Savings' | 'Credit' | 'Business';
    balance: number;
    status: 'ACTIVE'| 'INACTIVE' | 'CLOSED' | 'FROZEN';
}