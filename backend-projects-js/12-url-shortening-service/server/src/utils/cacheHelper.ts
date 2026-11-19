import { redisClient } from "../config/redis.js";

/**
 * Evicts a URL cache entry and its temporary password-update lock.
 */
export const invalidateUrlCache = async (shortCode: string): Promise<void> => {
  try {
    if (redisClient?.isOpen && shortCode) {
      await redisClient.del([`url:${shortCode}`, `url:locked:${shortCode}`]);
    }
  } catch (error) {
    console.error(`[CACHE EVICTION ERROR] Failed to purge key url:${shortCode}`, error);
  }
};

/**
 * Evicts multiple URL cache entries and their temporary locks.
 */
export const invalidateBulkUrlCache = async (shortCodes: string[]): Promise<void> => {
  try {
    if (redisClient?.isOpen && shortCodes.length > 0) {
      const keys = shortCodes.flatMap((code) => [`url:${code}`, `url:locked:${code}`]);
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("[CACHE EVICTION ERROR] Failed to purge bulk keys", error);
  }
};
