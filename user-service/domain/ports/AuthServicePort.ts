import { User } from "../User";

export interface AuthServicePort {
  
  register(username: string, email: string, password: string): Promise<User>;
  login(username: string, password: string): Promise<string>;
  logout(token: string): Promise<void>;
}
