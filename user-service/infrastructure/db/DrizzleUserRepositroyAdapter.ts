import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { users, User as DBUser, NewUser } from "./schema";
import { User } from "../../domain/User";
import { UserRepositoryPort } from "../../domain/ports/UserRepositoryPort";

function toDomain(user: DBUser): User {
  return new User(
    user.id.toString(),
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
    const [result] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result ? toDomain(result) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [result] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result ? toDomain(result) : null;
  }

  async save(newUser: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const [result] = await this.db.insert(users).values({
      username: newUser.username,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
    }).returning();
    return toDomain(result);
  }
}
