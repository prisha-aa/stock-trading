import { User } from "../User";

export interface UserRepositoryPort {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}
