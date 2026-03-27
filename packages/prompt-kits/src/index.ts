interface BrandBriefInput {
  projectName: string;
  businessName: string;
  niche: string;
  targetAudience: string;
  tone: string;
  valueProposition: string;
  channels: string[];
  additionalContext?: string;
}

export const buildStarterKitPrompt = (brief: BrandBriefInput, twistText?: string): string => {
  return [
    "You are a senior brand strategist.",
    "Generate a concise brand starter kit in valid JSON only.",
    "Required keys: brandNames[3], taglines[3], mission, voicePillars[4], socialBios[5].",
    `Business name: ${brief.businessName}`,
    `Niche: ${brief.niche}`,
    `Audience: ${brief.targetAudience}`,
    `Tone: ${brief.tone}`,
    `Value proposition: ${brief.valueProposition}`,
    `Channels: ${brief.channels.join(", ")}`,
    brief.additionalContext ? `Additional context: ${brief.additionalContext}` : "",
    twistText ? `Mandatory twist constraints: ${twistText}` : ""
  ]
    .filter(Boolean)
    .join("\n");
};

export const buildLogoDirectionPrompt = (brief: BrandBriefInput, twistText?: string): string => {
  return [
    "You are a creative director.",
    "Generate logo direction pack in JSON only.",
    "Required keys: directions[3] with title, styleKeywords[5], colorPalette[4 hex], typographyNotes, imagePrompt.",
    `Brand: ${brief.businessName}`,
    `Niche: ${brief.niche}`,
    `Audience: ${brief.targetAudience}`,
    `Tone: ${brief.tone}`,
    `Value proposition: ${brief.valueProposition}`,
    twistText ? `Mandatory twist constraints: ${twistText}` : ""
  ]
    .filter(Boolean)
    .join("\n");
};

export const buildCampaignPackPrompt = (brief: BrandBriefInput, twistText?: string): string => {
  return [
    "You are a growth marketer.",
    "Generate campaign launch pack in JSON only.",
    "Required keys: heroHeadlines[3], adCopies[4], emailSubjectLines[4], ctas[4].",
    `Business: ${brief.businessName}`,
    `Niche: ${brief.niche}`,
    `Audience: ${brief.targetAudience}`,
    `Tone: ${brief.tone}`,
    `Primary channels: ${brief.channels.join(", ")}`,
    `Value proposition: ${brief.valueProposition}`,
    twistText ? `Mandatory twist constraints: ${twistText}` : ""
  ]
    .filter(Boolean)
    .join("\n");
};
