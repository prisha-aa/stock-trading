export interface EmailServicePort {
  sendPasswordReset(email: string, token: string): Promise<void>;
}