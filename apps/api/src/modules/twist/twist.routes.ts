import { Router } from "express";
import { twistController } from "./twist.controller.js";

export const twistRoutes = Router();

twistRoutes.get("/active", (req, res) => twistController.getActiveRule(req, res));
