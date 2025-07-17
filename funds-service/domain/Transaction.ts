export type TransactionType = 'deposit' | 'withdrawal';
export interface Transaction {
    transactionId: string;
    userId:number;
    type: TransactionType;
    amount: number;
    description?: string;
    date: Date;
}