import { TokenRepositoryPort } from "../domain/ports/TokenRepositoryPort";
import { UserRepositoryPort } from "../domain/ports/UserRepositoryPort";
import bcrypt from "bcrypt";

export class ResetPasswordUseCase {
    constructor(
        private userRepository: UserRepositoryPort,
        private tokenRepository: TokenRepositoryPort,
    ){}

    async execute(token: string, newPassword: string): Promise<void> {
        const tokenRecord = await this.tokenRepository.findByToken(token);
        if (!tokenRecord) throw new Error("Invalid token");
        
        const user = await this.userRepository.findById(tokenRecord.userId);
        if (!user) throw new Error("Invalid token");
        
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(user);
        await this.tokenRepository.delete(token);
        console.log("🔑 Password reset successfully");

    }

}
