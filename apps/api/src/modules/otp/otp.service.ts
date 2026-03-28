import argon2 from "argon2";
import { randomInt } from "node:crypto";
import { ApiError } from "../../common/errors/api-error.js";
import { env } from "../../config/env.js";
import { logger } from "../../common/logger/logger.js";
import { getRedis } from "../../infrastructure/cache/redis.js";
import { emailService } from "../../infrastructure/email/email.service.js";
import { OtpChallengeModel } from "./otp.model.js";

const BYPASS_CODE = "000000";

const key = (email: string, purpose: string): string => `otp:${purpose}:${email.toLowerCase()}`;

class OtpService {
  private generateCode(): string {
    return String(randomInt(100000, 999999));
  }

  async sendOtp(email: string, purpose: "register" | "login" | "reset"): Promise<void> {
    const redis = getRedis();
    const redisKey = key(email, purpose);
    const cooldown = await redis.get(`${redisKey}:cooldown`);
    if (cooldown) {
      throw new ApiError(429, "OTP resend cooldown active", "OTP_COOLDOWN");
    }

    const code = this.generateCode();
    const codeHash = await argon2.hash(code);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + env.OTP_TTL_SECONDS * 1000);

    await OtpChallengeModel.create({
      email: email.toLowerCase(),
      purpose,
      codeHash,
      expiresAt,
      sentAt: now,
      attempts: 0
    });

    await redis.set(`${redisKey}:cooldown`, "1", {
      EX: env.OTP_RESEND_COOLDOWN_SECONDS
    });

    await emailService.sendOtp(email, code, purpose);
  }

  async verifyOtp(email: string, purpose: "register" | "login" | "reset", code: string): Promise<boolean> {
    if (env.OTP_BYPASS && code === BYPASS_CODE) {
      logger.info(`[OTP BYPASS] Accepting bypass code for ${email} (${purpose})`);
      return true;
    }

    const challenge = await OtpChallengeModel.findOne({
      email: email.toLowerCase(),
      purpose,
      consumedAt: null
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!challenge) {
      throw new ApiError(400, "OTP challenge not found", "OTP_NOT_FOUND");
    }

    if (challenge.expiresAt.getTime() < Date.now()) {
      throw new ApiError(400, "OTP expired", "OTP_EXPIRED");
    }

    challenge.attempts += 1;
    if (challenge.attempts > env.OTP_MAX_ATTEMPTS) {
      await challenge.save();
      throw new ApiError(429, "OTP attempts exceeded", "OTP_ATTEMPTS_EXCEEDED");
    }

    const isValid = await argon2.verify(challenge.codeHash, code);
    if (!isValid) {
      await challenge.save();
      return false;
    }

    challenge.consumedAt = new Date();
    await challenge.save();
    return true;
  }
}

export const otpService = new OtpService();
