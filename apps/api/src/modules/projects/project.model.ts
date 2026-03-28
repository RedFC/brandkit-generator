import { Schema, model } from "mongoose";

const BrandProjectSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    brief: {
      projectName: { type: String, required: true },
      businessName: { type: String, required: true },
      niche: { type: String, required: true },
      targetAudience: { type: String, required: true },
      tone: { type: String, required: true },
      valueProposition: { type: String, required: true },
      channels: [{ type: String, required: true }],
      additionalContext: { type: String }
    },
    status: { type: String, default: "draft", enum: ["draft", "active"] }
  },
  {
    timestamps: true
  }
);

export const BrandProjectModel = model("BrandProject", BrandProjectSchema);
