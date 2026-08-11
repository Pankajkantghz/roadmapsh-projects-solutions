import cron from "node-cron";
import { Url } from "../models/Url.js";
import { redisClient } from "../config/redis.js";

/**
 * Scheduled job to archive expired links and clean up Redis cache.
 * Runs every 15 minutes by default.
 */
export const startExpiredLinksCron = () => {
  // Cron syntax: "*/15 * * * *" -> Every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    try {
      const now = new Date();

      // 1. Find all active links that have reached their expiration time
      const expiredUrls = await Url.find({
        expiresAt: { $lte: now },
        isArchived: false,
      }).select("_id shortCode");

      if (expiredUrls.length === 0) {
        return;
      }

      const expiredIds = expiredUrls.map((url) => url._id);
      const expiredCodes = expiredUrls.map((url) => url.shortCode);

      // 2. Batch update MongoDB to set isArchived: true
      const updateResult = await Url.updateMany(
        { _id: { $in: expiredIds } },
        { $set: { isArchived: true } },
      );

      // 3. Evict expired short codes from Redis cache
      if (redisClient?.isOpen && expiredCodes.length > 0) {
        const redisKeys = expiredCodes.map((code) => `url-cache:${code}`);
        await redisClient.del(redisKeys);
      }

      console.log(
        `[CRON] Processed ${updateResult.modifiedCount} expired URL(s). Evicted from Redis.`,
      );
    } catch (error) {
      console.error("[CRON ERROR] Failed to clean up expired links:", error);
    }
  });

  console.log("⏰ Expired links cron service initialized (runs every 15m).");
};