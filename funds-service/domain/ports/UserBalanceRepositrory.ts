import { DrizzleTx } from "../../infrastructure/db/db";
import { Transaction } from "../Transaction";

export interface UserBalanceRepositoryPort {
    getBalance(userId: number,tx?:DrizzleTx): Promise<number>;
    updateBalance(userId: number, newBalance: number,tx?:DrizzleTx): Promise<void>;
}