import { Transaction, TransactionType } from "../../domain/Transaction";
import { transactions } from "./schema";
import { TransactionRepositoryPort } from "../../domain/ports/TransactionRepositoryPort";
import { eq, and, sql, desc } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InferSelectModel } from "drizzle-orm";

type TransactionRow = InferSelectModel<typeof transactions>;

export class DrizzleTransactionRepositoryAdapter implements TransactionRepositoryPort {
    constructor(private db: NodePgDatabase) {}

    


    async saveTransaction(transaction: Transaction): Promise<void> {
        const [result] = await this.db
            .insert(transactions)
            .values({
                transactionId: transaction.transactionId,
                userId: transaction.userId,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                date: transaction.date,
            })
            .returning();
    }
    async getTransactions(userId: number) {
    const result = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));

    return result.map((row:TransactionRow) => ({
      transactionId: row.transactionId,
      userId: row.userId,
      type: row.type as TransactionType,
      amount: row.amount,
      description: row.description ?? undefined,
      date: row.date,
    }));
  }


    async getBalance(userId: number): Promise<number> {
  const deposits = await this.db
    .select({ sum: sql`SUM(amount)` })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), eq(transactions.type, 'deposit')));

  const withdrawals = await this.db
    .select({ sum: sql`SUM(amount)` })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), eq(transactions.type, 'withdrawal')));

  const depositTotal = Number(deposits[0].sum ?? 0);
  const withdrawalTotal = Number(withdrawals[0].sum ?? 0);

  return depositTotal - withdrawalTotal;
}
}