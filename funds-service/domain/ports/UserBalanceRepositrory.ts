export interface UserBalanceRepositoryPort {
    getBalance(userId: number): Promise<number>;
    updateBalance(userId: number, newBalance: number): Promise<void>;
}