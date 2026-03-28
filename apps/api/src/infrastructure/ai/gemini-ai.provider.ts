import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  BrandBriefInput,
  CampaignPackOutput,
  LogoDirectionOutput,
  StarterKitOutput
} from "@studio/contracts";
import {
  buildStarterKitPrompt,
  buildLogoDirectionPrompt,
  buildCampaignPackPrompt
} from "@studio/prompt-kits";
import { env } from "../../config/env.js";
import { logger } from "../../common/logger/logger.js";
import type { AIProvider } from "./provider.js";

const MODEL_NAME = "gemini-2.0-flash";

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1]!.trim();
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first !== -1 && last !== -1) return raw.slice(first, last + 1);
  return raw;
}

export class GeminiAIProvider implements AIProvider {
  private model;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required when MOCK_AI_MODE is false");
    }
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      }
    });
  }

  private async generate<T>(prompt: string, label: string): Promise<T> {
    logger.info(`[Gemini] Generating ${label}...`);
    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    try {
      const json = extractJson(text);
      return JSON.parse(json) as T;
    } catch (parseError) {
      logger.error(`[Gemini] Failed to parse ${label} response`, { text, parseError });
      throw new Error(`Gemini returned invalid JSON for ${label}`);
    }
  }

  async generateStarterKit(brief: BrandBriefInput, twistText?: string, feedback?: string): Promise<StarterKitOutput> {
    const prompt = buildStarterKitPrompt(brief, twistText, feedback);
    return this.generate<StarterKitOutput>(prompt, "starter-kit");
  }

  async generateLogoDirection(brief: BrandBriefInput, twistText?: string, feedback?: string): Promise<LogoDirectionOutput> {
    const prompt = buildLogoDirectionPrompt(brief, twistText, feedback);
    return this.generate<LogoDirectionOutput>(prompt, "logo-direction");
  }

  async generateCampaignPack(brief: BrandBriefInput, twistText?: string, feedback?: string): Promise<CampaignPackOutput> {
    const prompt = buildCampaignPackPrompt(brief, twistText, feedback);
    return this.generate<CampaignPackOutput>(prompt, "campaign-pack");
  }
}
