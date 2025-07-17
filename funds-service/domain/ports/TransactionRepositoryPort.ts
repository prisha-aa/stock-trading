import { Transaction } from "../Transaction";

export interface TransactionRepositoryPort {
    saveTransaction(transaction: Transaction): Promise<void>;
    getTransactions(userId: number): Promise<Transaction[]>;
    getBalance(userId: number): Promise<number>;
}