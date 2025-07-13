import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users, User as DBUser } from "./schema";
import { User } from "../../domain/User";
import { UserRepositoryPort } from "../../domain/ports/UserRepositoryPort";

// Mapper: DBUser → Domain User
function toDomain(user: DBUser): User {
  return new User(
    user.id,
    user.username,
    user.email,
    user.passwordHash,
    user.createdAt,
    user.updatedAt
  );
}

export class DrizzleUserRepositoryAdapter implements UserRepositoryPort {
  constructor(private db: NodePgDatabase) {}

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return result.length ? toDomain(result[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return result.length ? toDomain(result[0]) : null;
  }

  async save(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const [result] = await this.db
      .insert(users)
      .values({
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
      })
      .returning();

    return toDomain(result);
  }
}
