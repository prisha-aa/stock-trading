import { FundDomainService } from "../domain/FundDomainService";
import { EventPublisherPort } from "../domain/ports/EventPublisherPort";
import { TransactionRepositoryPort } from "../domain/ports/TransactionRepositoryPort";
import { UserBalanceRepositoryPort } from "../domain/ports/UserBalanceRepositrory";
import { Transaction } from "../domain/Transaction";
import { TransactionType } from "../domain/Transaction";
import { v4 as uuidv4 } from 'uuid';
import {db as drizzleDb} from "../infrastructure/db/db";
import { DrizzleTx } from "../infrastructure/db/db";
import { outbox } from "../infrastructure/db/schema";
export type DrizzleDb = typeof drizzleDb;

export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: TransactionRepositoryPort,
        private eventPublisher: EventPublisherPort,
        private fundDomainService: FundDomainService,
        private userBalanceRepository: UserBalanceRepositoryPort,
        private db: DrizzleDb
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

        await this.db.transaction(async (tx) => {
        const balance = await this.userBalanceRepository.getBalance(userId,tx);
        console.log(`balance from database: ${balance}, amount: ${amount}`);
        await this.fundDomainService.validateTransaction(transaction.type, transaction.amount, balance);
         await this.transactionRepository.saveTransaction(transaction,tx);

        
        const newBalance= transaction.type === 'deposit' ? await this.fundDomainService.addBalance(transaction.amount, balance) : await this.fundDomainService.deductBalance(transaction.amount, balance);
        const orderId = uuidv4();
        
        await this.userBalanceRepository.updateBalance(transaction.userId, newBalance,tx);
        await tx.insert(outbox).values({
            event_type:"fund.updated",
            payload: {

          userId,
          orderId: orderId || null,
          transactionId: transaction.transactionId,
          type,
          amount,
          description,
          date: transaction.date.toISOString(),
          success: true,
        },
        status: "pending",
        });

});

return transaction;
    }
}