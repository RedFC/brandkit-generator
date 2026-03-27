import type {
  BrandBriefInput,
  CampaignPackOutput,
  LogoDirectionOutput,
  StarterKitOutput
} from "@studio/contracts";

export interface AIProvider {
  generateStarterKit(brief: BrandBriefInput, twistText?: string): Promise<StarterKitOutput>;
  generateLogoDirection(brief: BrandBriefInput, twistText?: string): Promise<LogoDirectionOutput>;
  generateCampaignPack(brief: BrandBriefInput, twistText?: string): Promise<CampaignPackOutput>;
}
