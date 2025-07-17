import { FundDomainService } from "../domain/FundDomainService";
import { TransactionRepositoryPort } from "../domain/ports/TransactionRepositoryPort";
import { Transaction } from "../domain/Transaction";

export class GetTransactionsUseCase {
    constructor(
        private transactionRepository: TransactionRepositoryPort,

    ) {}

    async execute(userId: number): Promise<{balance:number, transactions:Transaction[]}> {
        const transactions = await this.transactionRepository.getTransactions(userId);
        const balance = await this.transactionRepository.getBalance(userId);
        return {balance, transactions}; 
    }
}