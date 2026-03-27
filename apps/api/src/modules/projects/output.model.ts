import { Schema, model } from "mongoose";

const BrandOutputSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "BrandProject", required: true, index: true },
    outputType: {
      type: String,
      required: true,
      enum: ["starter-kit", "logo-direction", "campaign-pack"]
    },
    content: { type: Schema.Types.Mixed, required: true },
    twistValidation: {
      passed: { type: Boolean, default: true },
      appliedRuleVersion: { type: String, default: "" },
      evidence: [{ type: String }]
    }
  },
  {
    timestamps: true
  }
);

BrandOutputSchema.index({ projectId: 1, outputType: 1, createdAt: -1 });

export const BrandOutputModel = model("BrandOutput", BrandOutputSchema);
