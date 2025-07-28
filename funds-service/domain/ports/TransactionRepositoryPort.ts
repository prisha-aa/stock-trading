import { DrizzleTx } from "../../infrastructure/db/db";
import { Transaction } from "../Transaction";

export interface TransactionRepositoryPort {
    saveTransaction(transaction: Transaction,tx?:DrizzleTx): Promise<void>;
    getTransactions(userId: number): Promise<Transaction[]>;
    getBalance(userId: number,tx?:DrizzleTx): Promise<number>;
}