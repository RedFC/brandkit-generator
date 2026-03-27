import { createClient, type RedisClientType } from "@redis/client";
import { env } from "../../config/env.js";
import { logger } from "../../common/logger/logger.js";

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  if (redisClient?.isOpen) return redisClient;

  redisClient = createClient({ url: env.REDIS_URI });
  redisClient.on("error", (error) => {
    logger.error("Redis error", error);
  });

  await redisClient.connect();
  logger.info("Redis connected");
  return redisClient;
};

export const getRedis = (): RedisClientType => {
  if (!redisClient) {
    throw new Error("Redis not initialized");
  }
  return redisClient;
};
