import argon2 from "argon2";
import type {
  AuthLoginInput,
  AuthRegisterInput,
  ResetPasswordInput,
  UserPublic
} from "@studio/contracts";
import { ApiError } from "../../common/errors/api-error.js";
import { tokenService } from "./token.service.js";
import { otpService } from "../otp/otp.service.js";
import { UserModel } from "../users/user.model.js";
import { SessionModel } from "./session.model.js";

const toUserPublic = (doc: any): UserPublic => ({
  id: String(doc._id),
  fullName: doc.fullName,
  email: doc.email,
  role: doc.role,
  isVerified: doc.isVerified,
  createdAt: doc.createdAt.toISOString()
});

class AuthService {
  async register(input: AuthRegisterInput): Promise<void> {
    const exists = await UserModel.findOne({ email: input.email.toLowerCase() }).exec();
    if (exists) {
      throw new ApiError(409, "Email already exists", "EMAIL_EXISTS");
    }

    const passwordHash = await argon2.hash(input.password);
    await UserModel.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      passwordHash,
      role: "user",
      isVerified: false
    });

    await otpService.sendOtp(input.email, "register");
  }

  async verifyRegistrationOtp(email: string, code: string): Promise<UserPublic> {
    const valid = await otpService.verifyOtp(email, "register", code);
    if (!valid) {
      throw new ApiError(400, "Invalid OTP", "INVALID_OTP");
    }

    const user = await UserModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    ).exec();

    if (!user) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    return toUserPublic(user);
  }

  async login(input: AuthLoginInput, ip: string, userAgent: string): Promise<{
    user: UserPublic;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await UserModel.findOne({ email: input.email.toLowerCase() }).exec();
    if (!user) {
      throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const passwordOk = await argon2.verify(user.passwordHash, input.password);
    if (!passwordOk) {
      throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Account not verified", "ACCOUNT_NOT_VERIFIED");
    }

    const payload = {
      sub: String(user._id),
      email: user.email,
      role: user.role
    };

    const accessToken = tokenService.createAccessToken(payload);
    const refreshToken = tokenService.createRefreshToken(payload);
    const refreshTokenHash = await argon2.hash(refreshToken);

    await SessionModel.create({
      userId: user._id,
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip,
      userAgent
    });

    return {
      user: toUserPublic(user),
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = tokenService.verifyRefreshToken(refreshToken);

    const sessions = await SessionModel.find({
      userId: payload.sub,
      revokedAt: null,
      expiresAt: { $gt: new Date() }
    }).exec();

    let matchedSession: (typeof sessions)[number] | null = null;

    for (const session of sessions) {
      const matches = await argon2.verify(session.refreshTokenHash, refreshToken);
      if (matches) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new ApiError(401, "Invalid refresh token", "INVALID_REFRESH");
    }

    matchedSession.revokedAt = new Date();
    await matchedSession.save();

    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role
    };

    const newAccessToken = tokenService.createAccessToken(newPayload);
    const newRefreshToken = tokenService.createRefreshToken(newPayload);

    await SessionModel.create({
      userId: payload.sub,
      refreshTokenHash: await argon2.hash(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = tokenService.verifyRefreshToken(refreshToken);

    const sessions = await SessionModel.find({
      userId: payload.sub,
      revokedAt: null
    }).exec();

    for (const session of sessions) {
      const matches = await argon2.verify(session.refreshTokenHash, refreshToken);
      if (matches) {
        session.revokedAt = new Date();
        await session.save();
        return;
      }
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      return;
    }

    await otpService.sendOtp(email, "reset");
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const valid = await otpService.verifyOtp(input.email, "reset", input.code);
    if (!valid) {
      throw new ApiError(400, "Invalid OTP", "INVALID_OTP");
    }

    const passwordHash = await argon2.hash(input.newPassword);

    const user = await UserModel.findOneAndUpdate(
      { email: input.email.toLowerCase() },
      { passwordHash },
      { new: true }
    ).exec();

    if (!user) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }

    await SessionModel.updateMany({ userId: user._id, revokedAt: null }, { revokedAt: new Date() }).exec();
  }
}

export const authService = new AuthService();
