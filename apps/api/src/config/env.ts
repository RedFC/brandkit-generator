import { config } from "dotenv";
import { z } from "zod";

config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(8080),
  MONGO_URI: z.string().default("mongodb://localhost:27017/brandkit_generator"),
  REDIS_URI: z.string().default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: z.string().default("dev_access_secret_change_me"),
  JWT_REFRESH_SECRET: z.string().default("dev_refresh_secret_change_me"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@brandkit.local"),
  CORS_ORIGIN: z.string().default("http://localhost:4200"),
  OTP_TTL_SECONDS: z.coerce.number().default(300),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(5),
  MOCK_AI_MODE: z.coerce.boolean().default(true),
  GEMINI_API_KEY: z.string().default(""),
  OTP_BYPASS: z.coerce.boolean().default(false)
});

export const env = EnvSchema.parse(process.env);
