import { Schema, model } from "mongoose";

const TwistRuleSchema = new Schema(
  {
    version: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false },
    constraintText: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const TwistRuleModel = model("TwistRule", TwistRuleSchema);
