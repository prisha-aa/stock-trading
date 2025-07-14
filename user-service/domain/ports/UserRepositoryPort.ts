import { User } from "../User";

export interface UserRepositoryPort {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;

  save(userData: { username: string; email: string; passwordHash: string }): Promise<User>;

  findById(id: number): Promise<User | null>;
  update(user: User): Promise<void>;
  saveResetToken(userId: number, token: string, expiresAt: Date): Promise<void>;

}
