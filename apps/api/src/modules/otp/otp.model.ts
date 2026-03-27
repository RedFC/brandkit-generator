import { Schema, model } from "mongoose";

const OtpChallengeSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    purpose: { type: String, required: true, enum: ["register", "login", "reset"] },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    consumedAt: { type: Date, default: null },
    sentAt: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

OtpChallengeSchema.index({ email: 1, purpose: 1, consumedAt: 1, expiresAt: 1 });

export const OtpChallengeModel = model("OtpChallenge", OtpChallengeSchema);
