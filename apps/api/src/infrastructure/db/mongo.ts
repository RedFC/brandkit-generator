import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { logger } from "../../common/logger/logger.js";

let initialized = false;

export const connectMongo = async (): Promise<void> => {
  if (initialized) return;

  await mongoose.connect(env.MONGO_URI);
  initialized = true;
  logger.info("MongoDB connected");
};
