export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    isActive: boolean;
    role: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
}
