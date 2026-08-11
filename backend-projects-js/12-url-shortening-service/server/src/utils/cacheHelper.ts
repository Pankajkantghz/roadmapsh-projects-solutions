import { redisClient } from "../config/redis.js";

/**
 * Evicts a cached URL from Redis by its shortCode.
 */
export const invalidateUrlCache = async (shortCode: string): Promise<void> => {
  try {
    if (redisClient?.isOpen && shortCode) {
      await redisClient.del(`url:${shortCode}`);
    }
  } catch (error) {
    console.error(`[CACHE EVICTION ERROR] Failed to purge key url:${shortCode}`, error);
  }
};

/**
 * Evicts multiple cached URLs from Redis in a single pipeline execution.
 */
export const invalidateBulkUrlCache = async (shortCodes: string[]): Promise<void> => {
  try {
    if (redisClient?.isOpen && shortCodes.length > 0) {
      const keys = shortCodes.map((code) => `url:${code}`);
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("[CACHE EVICTION ERROR] Failed to purge bulk keys", error);
  }
};