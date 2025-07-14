import { EmailServicePort } from "../domain/ports/EmailServicePort";
import { UserRepositoryPort } from "../domain/ports/UserRepositoryPort";
import crypto from "crypto";

export class RequestPasswordResetUseCase {
  constructor(
    private emailService: EmailServicePort,
    private userRepo: UserRepositoryPort,

  ) {}
  async execute(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");   

    const token=crypto.randomBytes(32).toString('hex');
    const expiry=new Date(Date.now()+1000*60*30);

    await this.userRepo.saveResetToken(user.id,token,expiry);
    await this.emailService.sendPasswordReset(email,token);

    
  }
}