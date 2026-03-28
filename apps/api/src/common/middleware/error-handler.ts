import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";
import { logger } from "../logger/logger.js";

export const errorHandlerMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errorCode: "VALIDATION_ERROR",
      data: { issues: error.issues }
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode
    });
    return;
  }

  logger.error("Unhandled error", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    errorCode: "INTERNAL_ERROR"
  });
};
