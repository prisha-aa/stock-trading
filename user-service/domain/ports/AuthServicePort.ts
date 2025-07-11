import { User } from "../User";

export interface AuthServicePort {
  
  register(username: string, email: string, password: string): Promise<User>;
}