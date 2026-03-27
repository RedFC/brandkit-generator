import type { TwistValidationResult } from "@studio/contracts";
import { TwistRuleModel } from "./twist.model.js";

class TwistService {
  async getActiveRule(): Promise<{ version: string; constraintText: string } | null> {
    const rule = await TwistRuleModel.findOne({ isActive: true }).exec();
    if (!rule) return null;

    return {
      version: rule.version,
      constraintText: rule.constraintText
    };
  }

  async validateOutput(outputText: string): Promise<TwistValidationResult> {
    const active = await this.getActiveRule();
    if (!active) {
      return {
        passed: true,
        evidence: ["No active twist rule configured"]
      };
    }

    const passed = outputText.toLowerCase().includes(active.constraintText.toLowerCase());
    return {
      passed,
      appliedRuleVersion: active.version,
      evidence: passed
        ? [`Detected constraint text: ${active.constraintText}`]
        : [`Constraint text not detected: ${active.constraintText}`]
    };
  }
}

export const twistService = new TwistService();
