import { UserService } from "../core/UserService";
import { UpdateUserProfileInput, User } from "../domain/User";


export class UpdateUserProfileUseCase {
  constructor(private userService: UserService) {}

  async execute(userId: number, update: UpdateUserProfileInput): Promise<User> {
    return this.userService.update(userId, update);
  }
}
