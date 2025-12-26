import type {Account} from "./account";

export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    isActive: boolean;
    accounts: Account[];
    role: 'Admin' | 'Customer';
    createdAt?: string;
    updatedAt?: string;
}
