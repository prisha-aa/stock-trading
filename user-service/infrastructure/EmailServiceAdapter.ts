import nodemailer from "nodemailer";
import { EmailServicePort } from "../domain/ports/EmailServicePort";


export class EmailServiceAdapter implements EmailServicePort {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
     tls: {
    rejectUnauthorized: false,  // <--- This disables cert verification
  },
  });

  // async sendPasswordReset(email: string, token: string): Promise<void> {
  //   console.log("➡️ Sending email...");



  //   const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  //   await this.transporter.sendMail({
  //     to: email,
  //     subject: "Reset your password",
  //     html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
      
  //   });
  //   console.log("✅ Email sent");
  // }
  async sendPasswordReset(email: string, token: string): Promise<void> {
  console.log("➡️ Sending email to:", email);

  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log("🔗 Reset link:", link);

  try {
    const result = await this.transporter.sendMail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
    });
    console.log("✅ Email sent:", result);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw new Error("Could not send email");
  }
}

}
