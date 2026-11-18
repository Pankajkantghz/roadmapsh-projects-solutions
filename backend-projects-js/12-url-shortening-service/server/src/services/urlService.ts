import { Url } from "../models/Url.js";
import { Click } from "../models/Click.js";
import { Counter } from "../models/Counter.js";
import { encodeBase62 } from "../utils/base62.js";
import { redisClient } from "../config/redis.js";
import { AppError } from "../utils/AppError.js";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { IUrl, AnalyticsPayload, FilterQueries } from "../types/url.js";

const CACHE_TTL = 86400; // 24 Hours
const urlCacheKey = (shortCode: string) => `url:${shortCode}`;
const urlLockKey = (shortCode: string) => `url:locked:${shortCode}`;

async function cacheUrl(shortCode: string, originalUrl: string, expiresAt?: Date | null) {
  if (!redisClient.isOpen) return;
  const remaining = expiresAt ? Math.floor((expiresAt.getTime() - Date.now()) / 1000) : CACHE_TTL;
  if (remaining > 0) await redisClient.setEx(urlCacheKey(shortCode), Math.min(CACHE_TTL, remaining), originalUrl);
}

// Generates a shortened URL linked securely to the authenticated user.
export async function createShortUrl(
  originalUrl: string,
  customAlias: string | undefined,
  extraFields: Partial<
    Pick<IUrl, "tags" | "isFavorite" | "password" | "expiresAt">
  > = {},
  userId: string,
): Promise<IUrl> {
  // Case A: User requested a Custom Alias
  if (customAlias) {
    const aliasCollision = await Url.findOne({ shortCode: customAlias });
    if (aliasCollision) {
      throw new AppError(
        "This custom alias is already taken. Try another one.",
        400,
      );
    }

    const hashedPassword = extraFields.password ? await bcrypt.hash(extraFields.password, 12) : undefined;
    const urlRecord = await Url.create({
      originalUrl,
      shortCode: customAlias,
      user: userId,
      ...extraFields,
      ...(hashedPassword ? { password: hashedPassword } : {}),
    });

    if (!hashedPassword) await cacheUrl(customAlias, originalUrl, extraFields.expiresAt);
    return urlRecord;
  }

  // Case B: Optimization for identical plain links from the same user
  const isPlainLink =
    !extraFields.tags?.length &&
    !extraFields.isFavorite &&
    !extraFields.password &&
    !extraFields.expiresAt;

  if (isPlainLink) {
    const existingUrl = await Url.findOne({
      originalUrl,
      user: userId,
      isArchived: false,
      password: null,
      expiresAt: null,
    });

    if (existingUrl) {
      await cacheUrl(existingUrl.shortCode, existingUrl.originalUrl, existingUrl.expiresAt);
      return existingUrl;
    }
  }

  // Case C: Auto-generate code utilizing the Base62 sequence auto-increment pipeline
  let shortCode = "";
  let isUnique = false;

  while (!isUnique) {
    const counterRecord = await Counter.findOneAndUpdate(
      { _id: "url_sequence" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true },
    );

    shortCode = encodeBase62(counterRecord.seq);
    const collisionCheck = await Url.findOne({ shortCode });
    if (!collisionCheck) {
      isUnique = true;
    }
  }

  const hashedPassword = extraFields.password ? await bcrypt.hash(extraFields.password, 12) : undefined;
  const urlRecord = await Url.create({
    originalUrl,
    shortCode,
    user: userId,
    ...extraFields,
    ...(hashedPassword ? { password: hashedPassword } : {}),
  });

  if (!hashedPassword) await cacheUrl(shortCode, originalUrl, extraFields.expiresAt);
  return urlRecord;
}

// Retrieves links matching specific search/filter criteria belonging strictly to the request context owner.
export async function getUserUrls(userId: string, filters: FilterQueries) {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;

  // Ensure 'user' matches the exact key name in your Url Schema
  const queryCondition: any = {
    user: new Types.ObjectId(userId),
    isArchived: filters.archived ?? false,
  };

  if (filters.search) {
    queryCondition.$text = { $search: filters.search };
  }
  if (filters.tag) {
    queryCondition.tags = filters.tag;
  }
  if (typeof filters.isFavorite === "boolean") {
    queryCondition.isFavorite = filters.isFavorite;
  }

  const skipRows = (page - 1) * limit;

  const [links, totalRecords] = await Promise.all([
    Url.find(queryCondition)
      .sort({ createdAt: -1 })
      .skip(skipRows)
      .limit(limit)
      .lean(),
    Url.countDocuments(queryCondition),
  ]);

  return {
    links,
    pagination: {
      total: totalRecords,
      page,
      limit,
      pages: Math.ceil(totalRecords / limit) || 1,
    },
  };
}

// Core Public Redirection Router Target Resolution
export async function getShortUrlTarget(
  shortCode: string,
): Promise<string | null> {
  const cacheKey = urlCacheKey(shortCode);
  try {
    if (await redisClient.get(urlLockKey(shortCode))) return null;
    const cachedUrl = await redisClient.get(cacheKey);
    if (cachedUrl) return cachedUrl;

    const urlRecord = await Url.findOne({ shortCode, isArchived: false });
    if (!urlRecord) return null;
    if (urlRecord.password) return null;

    if (urlRecord.expiresAt && new Date() > urlRecord.expiresAt) {
      return null;
    }

    await cacheUrl(shortCode, urlRecord.originalUrl, urlRecord.expiresAt);
    return urlRecord.originalUrl;
  } catch (error) {
    console.error(`Cache/DB read failure for code [${shortCode}]:`, error);
    const fallbackRecord = await Url.findOne({ shortCode, isArchived: false });
    if (
      fallbackRecord &&
      fallbackRecord.expiresAt &&
      new Date() > fallbackRecord.expiresAt
    ) {
      return null;
    }
    return fallbackRecord && !fallbackRecord.password ? fallbackRecord.originalUrl : null;
  }
}

// Public Metrics ingestion execution framework
export async function recordClickMetrics(
  shortCode: string,
  analytics: AnalyticsPayload,
): Promise<void> {
  try {
    const urlRecord = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { returnDocument: "after" },
    );
    if (!urlRecord) return;

    await Click.create({ urlId: urlRecord._id, shortCode, ...analytics });
  } catch (error) {
    console.error(
      `Background Analytics Engine Failure [${shortCode}]:`,
      error,
    );
  }
}

// Aggregates deep analytics parameters for dashboards
export async function getUrlAnalytics(shortCode: string) {
  const urlRecord = await Url.findOne({ shortCode });
  if (!urlRecord) return null;

  const stats = await Click.aggregate([
    { $match: { shortCode } },
    {
      $facet: {
        devices: [
          { $group: { _id: "$device", count: { $sum: 1 } } },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ],
        browsers: [
          { $group: { _id: "$browser", count: { $sum: 1 } } },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ],
        os: [
          { $group: { _id: "$os", count: { $sum: 1 } } },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ],
        clicksOverTime: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { date: "$_id", count: 1, _id: 0 } },
        ],
      },
    },
  ]);

  return {
    totalClicks: urlRecord.clicks,
    originalUrl: urlRecord.originalUrl,
    createdAt: urlRecord.createdAt,
    metrics: stats[0],
  };
}

// Update an asset safely ensuring ownership boundaries are respected and clearing cache
export async function updateUrlAsset(
  id: string,
  userId: string,
  updateData: Partial<
    Pick<IUrl, "tags" | "isFavorite" | "password" | "expiresAt">
  >,
): Promise<IUrl | null> {
  const current = await Url.findOne({ _id: id, user: userId }).select("shortCode");
  if (!current) return null;
  if (updateData.password && redisClient.isOpen) {
    await redisClient.set(urlLockKey(current.shortCode), "1");
  }
  const safeUpdate = { ...updateData };
  if (safeUpdate.password) safeUpdate.password = await bcrypt.hash(safeUpdate.password, 12);
  const urlRecord = await Url.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: safeUpdate },
    { new: true, runValidators: true },
  );

  if (urlRecord) {
    await redisClient.del(urlCacheKey(urlRecord.shortCode));
    if (!urlRecord.password && redisClient.isOpen) {
      await redisClient.del(urlLockKey(urlRecord.shortCode));
    }
  }

  return urlRecord;
}

// Toggles long term storage archive setting securely and clears hot Redis cache paths
export async function toggleArchiveStatus(
  id: string,
  userId: string,
  isArchived: boolean,
): Promise<IUrl | null> {
  const urlRecord = await Url.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { isArchived } },
    { new: true },
  );

  if (urlRecord) {
    await redisClient.del(urlCacheKey(urlRecord.shortCode));
  }
  return urlRecord;
}

// Permanent single asset removal verifying authorization parameters
export async function permanentDeleteUrl(
  id: string,
  userId: string,
): Promise<boolean> {
  const urlRecord = await Url.findOneAndDelete({ _id: id, user: userId });
  if (!urlRecord) return false;

  await redisClient.del(urlCacheKey(urlRecord.shortCode));
  if (redisClient.isOpen) await redisClient.del(urlLockKey(urlRecord.shortCode));
  return true;
}

// Batched document delete routines validating owner authorization across selected targets
export async function bulkDeleteUrls(
  ids: string[],
  userId: string,
): Promise<{ deletedCount: number }> {
  // 1. Only find records that belong to this user out of the incoming array
  const targetRecords = await Url.find(
    { _id: { $in: ids }, user: userId },
    "shortCode",
  ).lean();

  if (targetRecords.length === 0) {
    return { deletedCount: 0 };
  }

  const cacheKeys = targetRecords.map((rec) => urlCacheKey(rec.shortCode));
  const lockKeys = targetRecords.map((rec) => urlLockKey(rec.shortCode));

  // 2. Clear matched entries from MongoDB
  const result = await Url.deleteMany({
    _id: { $in: targetRecords.map((r) => r._id) },
  });

  // 3. Clean up key values from Redis cache
  if (cacheKeys.length > 0) {
    await redisClient.del(cacheKeys);
    if (redisClient.isOpen) await redisClient.del(lockKeys);
  }

  return { deletedCount: result.deletedCount };
}
