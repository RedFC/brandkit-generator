import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./common/logger/logger.js";
import { connectMongo } from "./infrastructure/db/mongo.js";
import { connectRedis } from "./infrastructure/cache/redis.js";

const bootstrap = async (): Promise<void> => {
  await connectMongo();
  await connectRedis();

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`API running on http://localhost:${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  logger.error("Failed to bootstrap API", error);
  process.exit(1);
});
