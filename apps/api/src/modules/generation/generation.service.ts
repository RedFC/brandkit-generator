import type {
  BrandBriefInput,
  CampaignPackOutput,
  LogoDirectionOutput,
  StarterKitOutput
} from "@studio/contracts";
import {
  buildCampaignPackPrompt,
  buildLogoDirectionPrompt,
  buildStarterKitPrompt
} from "@studio/prompt-kits";
import { createHash } from "node:crypto";
import { MockAIProvider } from "../../infrastructure/ai/mock-ai.provider.js";
import { getRedis } from "../../infrastructure/cache/redis.js";
import { twistService } from "../twist/twist.service.js";

const aiProvider = new MockAIProvider();

class GenerationService {
  private hashPayload(prefix: string, payload: unknown): string {
    return `${prefix}:${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`;
  }

  async generateStarterKit(brief: BrandBriefInput): Promise<{ output: StarterKitOutput; prompt: string }> {
    const redis = getRedis();
    const activeRule = await twistService.getActiveRule();
    const cacheKey = this.hashPayload("gen:starter", { brief, activeRule });

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as { output: StarterKitOutput; prompt: string };
    }

    const prompt = buildStarterKitPrompt(brief, activeRule?.constraintText);
    const output = await aiProvider.generateStarterKit(brief, activeRule?.constraintText);
    const data = { output, prompt };

    await redis.set(cacheKey, JSON.stringify(data), { EX: 3600 });
    return data;
  }

  async generateLogoDirection(
    brief: BrandBriefInput
  ): Promise<{ output: LogoDirectionOutput; prompt: string }> {
    const redis = getRedis();
    const activeRule = await twistService.getActiveRule();
    const cacheKey = this.hashPayload("gen:logo", { brief, activeRule });

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as { output: LogoDirectionOutput; prompt: string };
    }

    const prompt = buildLogoDirectionPrompt(brief, activeRule?.constraintText);
    const output = await aiProvider.generateLogoDirection(brief, activeRule?.constraintText);
    const data = { output, prompt };

    await redis.set(cacheKey, JSON.stringify(data), { EX: 3600 });
    return data;
  }

  async generateCampaignPack(
    brief: BrandBriefInput
  ): Promise<{ output: CampaignPackOutput; prompt: string }> {
    const redis = getRedis();
    const activeRule = await twistService.getActiveRule();
    const cacheKey = this.hashPayload("gen:campaign", { brief, activeRule });

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as { output: CampaignPackOutput; prompt: string };
    }

    const prompt = buildCampaignPackPrompt(brief, activeRule?.constraintText);
    const output = await aiProvider.generateCampaignPack(brief, activeRule?.constraintText);
    const data = { output, prompt };

    await redis.set(cacheKey, JSON.stringify(data), { EX: 3600 });
    return data;
  }
}

export const generationService = new GenerationService();
