import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || `redis://127.0.0.1:6379`,
});

redisClient.on("error", (err) => console.error("Redis client Error:", err));

redisClient.on("connect", () => console.log(`Redis Core Engine Connected`));

export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export { redisClient };
