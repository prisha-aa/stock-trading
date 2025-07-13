import { User } from "../domain/User";
import { UserService } from "../core/UserService";



export class LoginUserUseCase {
  constructor(private userService: UserService) {}

  async execute(username: string, password: string): Promise<string> {
    return this.userService.login(username, password);
  }
}