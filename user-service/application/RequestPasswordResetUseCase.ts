import { EmailServicePort } from "../domain/ports/EmailServicePort";
import { TokenRepositoryPort } from "../domain/ports/TokenRepositoryPort";
import { UserRepositoryPort } from "../domain/ports/UserRepositoryPort";
import crypto from "crypto";

export class RequestPasswordResetUseCase {
  constructor(
    private userRepository: UserRepositoryPort,
    private tokenRepository: TokenRepositoryPort,
    private emailService: EmailServicePort
  ) {}

  async execute(email: string): Promise<void> {
    console.log("📩 Incoming password reset request:", { email });

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(32).toString("hex");

    await this.tokenRepository.save({
  userId: user.id,
  token,
  createdAt: new Date(),
});

    
    console.log("📬 Calling emailService.sendPasswordReset...");
    await this.emailService.sendPasswordReset(email, token);
  }
}
