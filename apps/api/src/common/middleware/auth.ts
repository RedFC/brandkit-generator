import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../errors/api-error.js";
import { env } from "../../config/env.js";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export const authGuard = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch {
    throw new ApiError(401, "Invalid token", "INVALID_TOKEN");
  }
};
