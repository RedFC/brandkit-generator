import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

class TokenService {
  createAccessToken(payload: TokenPayload): string {
    const expiresIn = env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"];
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn
    });
  }

  createRefreshToken(payload: TokenPayload): string {
    const expiresIn = env.REFRESH_TOKEN_TTL as jwt.SignOptions["expiresIn"];
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }
}

export const tokenService = new TokenService();
