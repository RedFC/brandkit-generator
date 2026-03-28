import { Router, type Request, type Response, type NextFunction } from "express";
import { authController } from "./auth.controller.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export const authRoutes = Router();

authRoutes.post("/register", asyncHandler((req, res) => authController.register(req, res)));
authRoutes.post("/verify-otp", asyncHandler((req, res) => authController.verifyOtp(req, res)));
authRoutes.post("/login", asyncHandler((req, res) => authController.login(req, res)));
authRoutes.post("/refresh", asyncHandler((req, res) => authController.refresh(req, res)));
authRoutes.post("/logout", asyncHandler((req, res) => authController.logout(req, res)));
authRoutes.post("/forgot-password", asyncHandler((req, res) => authController.forgotPassword(req, res)));
authRoutes.post("/reset-password", asyncHandler((req, res) => authController.resetPassword(req, res)));

