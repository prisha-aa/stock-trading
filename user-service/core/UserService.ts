
import { AuthServicePort } from "../domain/ports/AuthServicePort";
import { UserRepositoryPort } from "../domain/ports/UserRepositoryPort";
import { EventPublisherPort } from "../domain/ports/EventPublisherPort";
import { User } from "../domain/User";
import bcrypt from "bcrypt";


export class UserService implements AuthServicePort {
  constructor(
    private userRepository: UserRepositoryPort,
    private eventPublisher: EventPublisherPort
  ) {}

  async register(username: string, email: string, password: string): Promise<User> {
    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) throw new Error("Username already exists");

    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.save({
      username,
      email,
      passwordHash,
    });

    await this.eventPublisher.publish("user.registered", {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });

    return newUser;
  }

}