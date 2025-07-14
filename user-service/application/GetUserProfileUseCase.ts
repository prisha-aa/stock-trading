import { UserService } from "../core/UserService";
import { User } from "../domain/User";

export class GetUserProfileUseCase {
  constructor(private userService: UserService) {}
  async execute(userId: number): Promise<User> {
    return this.userService.getProfile(userId);
  }
}