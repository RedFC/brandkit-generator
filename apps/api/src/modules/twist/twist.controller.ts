import type { Request, Response } from "express";
import { ok } from "../../common/utils/response.js";
import { twistService } from "./twist.service.js";

class TwistController {
  async getActiveRule(_req: Request, res: Response): Promise<Response> {
    const rule = await twistService.getActiveRule();
    return ok(res, "Active twist rule fetched", {
      rule
    });
  }
}

export const twistController = new TwistController();
