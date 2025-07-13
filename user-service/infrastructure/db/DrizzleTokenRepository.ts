import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { tokens } from "./schema";
import { TokenRepositoryPort } from "../../domain/ports/TokenRepositoryPort";

export class DrizzleTokenRepository implements TokenRepositoryPort {
  constructor(private db: NodePgDatabase) {}

  async save({ userId, token, createdAt }: { userId: number; token: string; createdAt: Date }): Promise<void> {
    await this.db.insert(tokens).values({ userId: Number(userId), token, createdAt });
    console.log("Saving token with userId:", userId, "typeof:", typeof userId);

  }

  async delete(token: string): Promise<void> {
    await this.db.delete(tokens).where(eq(tokens.token, token));
  }

  async exists(token: string): Promise<boolean> {
    const result = await this.db.select().from(tokens).where(eq(tokens.token, token));
    return result.length > 0;
  }
}
