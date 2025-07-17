import { TransactionType } from "./Transaction";

export class FundDomainService {
    async validateTransaction(type: TransactionType, amount: number, balance: number) {

        if (amount <= 0) {
            throw new Error('Amount must be a positive number');
        }

        if (type === 'withdrawal' && amount>balance) {
          console.log(`balance: ${balance}, amount: ${amount}`);
            throw new Error('Insufficient funds');
        }
          
    }

    async deductBalance(amount: number, balance: number): Promise<number> {
    return balance - amount;
  }

  async addBalance(amount: number, balance: number): Promise<number> {
    return balance + amount;
  }
}