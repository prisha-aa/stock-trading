import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UserBalanceRepositoryPort } from "../../domain/ports/UserBalanceRepositrory";
import { user_balances } from "./schema";
import { eq } from "drizzle-orm";

export class DrizzleUserBalanceRepositoryAdapter implements UserBalanceRepositoryPort {
    constructor(private db: NodePgDatabase) {}

    async getBalance(userId: number): Promise<number> {
    const [row] = await this.db
      .select()
      .from(user_balances)
      .where(eq(user_balances.userId, userId));
      console.log(`[getBalance] Fetched for user ${userId}:`, row); 
    return row?.balance ?? 0;
  }


  async updateBalance(userId: number, newBalance: number): Promise<void> {
    await this.db
      .update(user_balances)
      .set({ balance: newBalance })
      .where(eq(user_balances.userId, userId));
  }





}