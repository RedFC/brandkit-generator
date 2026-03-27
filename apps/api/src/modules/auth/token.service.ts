import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

class TokenService {
  createAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.ACCESS_TOKEN_TTL
    });
  }

  createRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.REFRESH_TOKEN_TTL
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }
}

export const tokenService = new TokenService();
