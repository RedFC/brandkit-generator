export interface BrandBrief {
  projectName: string;
  businessName: string;
  niche: string;
  targetAudience: string;
  tone: "professional" | "playful" | "bold" | "minimal" | "friendly";
  valueProposition: string;
  channels: string[];
  additionalContext?: string;
}

export interface BrandProject {
  _id: string;
  userId: string;
  brief: BrandBrief;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutputRecord {
  _id: string;
  projectId: string;
  outputType: "starter-kit" | "logo-direction" | "campaign-pack";
  content: unknown;
  twistValidation: {
    passed: boolean;
    appliedRuleVersion?: string;
    evidence: string[];
  };
  createdAt: string;
}
