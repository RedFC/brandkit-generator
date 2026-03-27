import type {
  BrandBriefInput,
  CampaignPackOutput,
  LogoDirectionOutput,
  StarterKitOutput
} from "@studio/contracts";
import type { AIProvider } from "./provider.js";

const slug = (text: string): string => text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export class MockAIProvider implements AIProvider {
  async generateStarterKit(brief: BrandBriefInput, twistText?: string): Promise<StarterKitOutput> {
    const base = slug(brief.businessName).split(" ")[0] ?? "brand";
    return {
      brandNames: [
        `${brief.businessName}`,
        `${base}ly`,
        `${base}nova`
      ],
      taglines: [
        `${brief.tone} solutions for ${brief.targetAudience}`,
        `Built for ${brief.niche}, designed to scale`,
        `From idea to impact, faster`
      ],
      mission: `Help ${brief.targetAudience} achieve better outcomes in ${brief.niche} through practical and reliable experiences.${twistText ? ` Constraint: ${twistText}` : ""}`,
      voicePillars: ["clear", "human", brief.tone, "confident"],
      socialBios: [
        `Helping ${brief.targetAudience} with ${brief.niche}.`,
        `${brief.businessName} | ${brief.valueProposition.slice(0, 90)}`,
        `Smart ${brief.niche} workflows for modern teams.`,
        `Practical growth for ${brief.targetAudience}.`,
        `Built with focus, clarity, and measurable impact.`
      ]
    };
  }

  async generateLogoDirection(brief: BrandBriefInput, twistText?: string): Promise<LogoDirectionOutput> {
    return {
      directions: [
        {
          title: "Modern Minimal",
          styleKeywords: ["minimal", "clean", "geometric", brief.tone, "modern"],
          colorPalette: ["#1D4ED8", "#0F172A", "#E2E8F0", "#F8FAFC"],
          typographyNotes: "Use a geometric sans-serif with medium weight and open spacing.",
          imagePrompt: `Create a minimal brand logo for ${brief.businessName} in ${brief.niche}, clean geometric icon, flat style${twistText ? `, include rule: ${twistText}` : ""}.`
        },
        {
          title: "Trust and Professional",
          styleKeywords: ["trust", "professional", "bold", "clarity", "balanced"],
          colorPalette: ["#0EA5E9", "#111827", "#94A3B8", "#FFFFFF"],
          typographyNotes: "Use a semi-bold humanist sans-serif with stable baseline and compact kerning.",
          imagePrompt: `Design a professional logo mark and wordmark for ${brief.businessName}, audience ${brief.targetAudience}, modern corporate style${twistText ? `, with ${twistText}` : ""}.`
        },
        {
          title: "Playful Signature",
          styleKeywords: ["friendly", "dynamic", "vibrant", "memorable", "approachable"],
          colorPalette: ["#F97316", "#16A34A", "#111827", "#FDF4FF"],
          typographyNotes: "Use rounded sans-serif for approachability with one custom character for signature identity.",
          imagePrompt: `Generate a playful but premium logo concept for ${brief.businessName}, include abstract icon and bright accents${twistText ? `, enforce ${twistText}` : ""}.`
        }
      ]
    };
  }

  async generateCampaignPack(brief: BrandBriefInput, twistText?: string): Promise<CampaignPackOutput> {
    return {
      heroHeadlines: [
        `Launch smarter in ${brief.niche}`,
        `${brief.businessName}: Built for ${brief.targetAudience}`,
        `Make every campaign count`
      ],
      adCopies: [
        `Tired of slow results in ${brief.niche}? ${brief.businessName} helps ${brief.targetAudience} move faster with practical outcomes.`,
        `Built for teams that need clarity and action. Start using ${brief.businessName} today.`,
        `Your next growth leap starts with one focused system.`,
        `From strategy to execution, ${brief.businessName} keeps momentum high.${twistText ? ` (${twistText})` : ""}`
      ],
      emailSubjectLines: [
        `Introducing ${brief.businessName}`,
        `Your new edge in ${brief.niche}`,
        `A faster way to execute your strategy`,
        `Ready to launch with confidence?`
      ],
      ctas: ["Start now", "See the demo", "Get your brand kit", "Launch campaign"]
    };
  }
}
