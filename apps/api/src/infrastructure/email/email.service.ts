import nodemailer from "nodemailer";
import { env } from "../../config/env.js";
import { logger } from "../../common/logger/logger.js";

class EmailService {
  private transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS
        }
      : undefined
  });

  async sendOtp(email: string, code: string, purpose: string): Promise<void> {
    const subject = `Your ${purpose} OTP code`;
    const text = `Your OTP code is ${code}. It expires in ${Math.floor(env.OTP_TTL_SECONDS / 60)} minutes.`;

    try {
      await this.transport.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject,
        text
      });
    } catch (error) {
      logger.warn("Failed to send OTP via SMTP. Falling back to log output.", error);
      logger.info(`OTP fallback ${purpose} -> ${email}: ${code}`);
    }
  }
}

export const emailService = new EmailService();
