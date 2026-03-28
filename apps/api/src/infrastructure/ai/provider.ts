import type {
  StarterKitOutput,
  LogoDirectionOutput,
  CampaignPackOutput,
  BrandBriefInput
} from "@studio/contracts";

export interface AIProvider {
  generateStarterKit(brief: BrandBriefInput, twistText?: string, feedback?: string): Promise<StarterKitOutput>;
  generateLogoDirection(brief: BrandBriefInput, twistText?: string, feedback?: string): Promise<LogoDirectionOutput>;
  generateCampaignPack(brief: BrandBriefInput, twistText?: string, feedback?: string): Promise<CampaignPackOutput>;
}
