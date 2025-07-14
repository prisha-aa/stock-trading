import nodemailer from "nodemailer";
import { EmailServicePort } from "../domain/ports/EmailServicePort";


export class EmailServiceAdapter implements EmailServicePort {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
    });
  }
}
