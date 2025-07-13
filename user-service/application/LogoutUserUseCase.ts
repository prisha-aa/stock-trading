import { User } from "../domain/User";
import { UserService } from "../core/UserService";



export class LogoutUserUseCase {
  constructor(private userService: UserService) {}

  async execute(token: string): Promise<void> {
    return this.userService.logout(token);
  }
}