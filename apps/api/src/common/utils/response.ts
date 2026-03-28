import type { Response } from "express";

export const ok = <T>(res: Response, message: string, data?: T): Response => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

export const created = <T>(res: Response, message: string, data?: T): Response => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};
