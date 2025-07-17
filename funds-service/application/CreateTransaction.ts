import { FundDomainService } from "../domain/FundDomainService";
import { EventPublisherPort } from "../domain/ports/EventPublisherPort";
import { TransactionRepositoryPort } from "../domain/ports/TransactionRepositoryPort";
import { UserBalanceRepositoryPort } from "../domain/ports/UserBalanceRepositrory";
import { Transaction } from "../domain/Transaction";
import { TransactionType } from "../domain/Transaction";
import { v4 as uuidv4 } from 'uuid';

export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: TransactionRepositoryPort,
        private eventPublisher: EventPublisherPort,
        private fundDomainService: FundDomainService,
        private userBalanceRepository: UserBalanceRepositoryPort
    ) {}

    async execute(userId: number, type: TransactionType, amount: number, description?: string,orderId?: string | null): Promise<Transaction> {
        const transaction: Transaction = {
            transactionId: uuidv4(),
            userId: userId,
            type: type,
            amount: amount,
            description: description,
            date: new Date()
        };

        const balance = await this.userBalanceRepository.getBalance(transaction.userId);
        console.log(`balance from database: ${balance}, amount: ${amount}`);
        await this.fundDomainService.validateTransaction(transaction.type, transaction.amount, balance);
         await this.transactionRepository.saveTransaction(transaction);

        
        const newBalance= transaction.type === 'deposit' ? await this.fundDomainService.addBalance(transaction.amount, balance) : await this.fundDomainService.deductBalance(transaction.amount, balance);
        
        await this.userBalanceRepository.updateBalance(transaction.userId, newBalance);
        
        

        
       
        await this.eventPublisher.publish("fund.updated", {
            userId: transaction.userId,
            orderId: orderId || null,
            transactionId: transaction.transactionId,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date.toISOString(),
            success: true,

});

return transaction;
    }
}