import type { Request, Response } from "express";
import {
  AuthLoginSchema,
  AuthRegisterSchema,
  ForgotPasswordSchema,
  OtpVerifySchema,
  ResetPasswordSchema
} from "@studio/contracts";
import { ok, created } from "../../common/utils/response.js";
import { authService } from "./auth.service.js";

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const input = AuthRegisterSchema.parse(req.body);
    await authService.register(input);
    return created(res, "Registration successful. OTP sent to email");
  }

  async verifyOtp(req: Request, res: Response): Promise<Response> {
    const input = OtpVerifySchema.parse(req.body);
    const user = await authService.verifyRegistrationOtp(input.email, input.code);
    return ok(res, "OTP verified successfully", { user });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const input = AuthLoginSchema.parse(req.body);
    const result = await authService.login(
      input,
      String(req.ip || ""),
      String(req.headers["user-agent"] || "")
    );

    return ok(res, "Login successful", result);
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "refreshToken is required" });
    }

    const tokens = await authService.refresh(refreshToken);
    return ok(res, "Token refreshed", tokens);
  }

  async logout(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "refreshToken is required" });
    }

    await authService.logout(refreshToken);
    return ok(res, "Logout successful");
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const input = ForgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(input.email);
    return ok(res, "If account exists, OTP has been sent");
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const input = ResetPasswordSchema.parse(req.body);
    await authService.resetPassword(input);
    return ok(res, "Password reset successful");
  }
}

export const authController = new AuthController();
