import { User } from "../domain/User";
import { UserService } from "../core/UserService";



export class RegisterUserUseCase {
  constructor(private userService: UserService) {}

  async execute(username: string, email: string, password: string): Promise<User> {
    return this.userService.register(username, email, password);
  }
}
