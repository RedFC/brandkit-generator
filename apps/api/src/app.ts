import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { notFoundMiddleware } from "./common/middleware/not-found.js";
import { errorHandlerMiddleware } from "./common/middleware/error-handler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { projectRoutes } from "./modules/projects/projects.routes.js";
import { twistRoutes } from "./modules/twist/twist.routes.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "ok",
      data: {
        service: "api",
        timestamp: new Date().toISOString()
      }
    });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/projects", projectRoutes);
  app.use("/api/v1/twist", twistRoutes);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
};
