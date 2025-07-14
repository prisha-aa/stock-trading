
import { AuthServicePort } from "../domain/ports/AuthServicePort";
import { UserRepositoryPort } from "../domain/ports/UserRepositoryPort";
import { EventPublisherPort } from "../domain/ports/EventPublisherPort";
import { UpdateUserProfileInput, User } from "../domain/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TokenRepositoryPort } from "../domain/ports/TokenRepositoryPort";

export class UserService implements AuthServicePort {
  constructor(
    private userRepository: UserRepositoryPort,
    private eventPublisher: EventPublisherPort,
    private tokenRepo: TokenRepositoryPort,
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

async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
if (!user) throw new Error("User not found");

const passwordMatch = await bcrypt.compare(password, user.passwordHash);
if (!passwordMatch) throw new Error("Invalid credentials");

const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
  expiresIn: "24h",
});

await this.tokenRepo.save({ userId: user.id, token, createdAt: new Date() })

return token;


}
 async logout(token: string): Promise<void> {
    await this.tokenRepo.delete(token);


}
async getProfile(userId:number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;}

async update(
  userId: number,
  update: UpdateUserProfileInput
): Promise<User> {
  const { email, firstName, lastName } = update;
  const user = await this.userRepository.findById(userId);
  if (!user) throw new Error("User not found");

  if (email !== undefined) user.email = email;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;

  await this.userRepository.update(user);
  return user;
}

}