import { Router } from "express";
import { authController } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", (req, res) => authController.register(req, res));
authRoutes.post("/verify-otp", (req, res) => authController.verifyOtp(req, res));
authRoutes.post("/login", (req, res) => authController.login(req, res));
authRoutes.post("/refresh", (req, res) => authController.refresh(req, res));
authRoutes.post("/logout", (req, res) => authController.logout(req, res));
authRoutes.post("/forgot-password", (req, res) => authController.forgotPassword(req, res));
authRoutes.post("/reset-password", (req, res) => authController.resetPassword(req, res));
