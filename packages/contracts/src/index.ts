import { z } from "zod";

export const RoleSchema = z.enum(["user", "admin"]);
export type Role = z.infer<typeof RoleSchema>;

export const AuthRegisterSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, "Password must include one uppercase letter")
    .regex(/[a-z]/, "Password must include one lowercase letter")
    .regex(/[0-9]/, "Password must include one digit")
});
export type AuthRegisterInput = z.infer<typeof AuthRegisterSchema>;

export const AuthLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
export type AuthLoginInput = z.infer<typeof AuthLoginSchema>;

export const OtpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  purpose: z.enum(["register", "login", "reset"])
});
export type OtpVerifyInput = z.infer<typeof OtpVerifySchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email()
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const BrandBriefSchema = z.object({
  projectName: z.string().min(2).max(120),
  businessName: z.string().min(2).max(120),
  niche: z.string().min(2).max(200),
  targetAudience: z.string().min(2).max(400),
  tone: z.enum(["professional", "playful", "bold", "minimal", "friendly"]),
  valueProposition: z.string().min(2).max(800),
  channels: z.array(z.enum(["instagram", "linkedin", "x", "email", "facebook", "tiktok"]))
    .min(1)
    .max(4),
  additionalContext: z.string().max(1500).optional()
});
export type BrandBriefInput = z.infer<typeof BrandBriefSchema>;

export const CreateProjectSchema = z.object({
  brief: BrandBriefSchema
});
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const GenerateRequestSchema = z.object({
  regenerate: z.boolean().optional().default(false)
});
export type GenerateRequestInput = z.infer<typeof GenerateRequestSchema>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

export interface UserPublic {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
}

export interface StarterKitOutput {
  brandNames: string[];
  taglines: string[];
  mission: string;
  voicePillars: string[];
  socialBios: string[];
}

export interface LogoDirectionOutput {
  directions: Array<{
    title: string;
    styleKeywords: string[];
    colorPalette: string[];
    typographyNotes: string;
    imagePrompt: string;
  }>;
}

export interface CampaignPackOutput {
  heroHeadlines: string[];
  adCopies: string[];
  emailSubjectLines: string[];
  ctas: string[];
}

export type GenerationOutputType = "starter-kit" | "logo-direction" | "campaign-pack";

export interface ProjectOutputRecord<T> {
  id: string;
  projectId: string;
  outputType: GenerationOutputType;
  content: T;
  createdAt: string;
}

export interface TwistValidationResult {
  passed: boolean;
  appliedRuleVersion?: string;
  evidence: string[];
}
