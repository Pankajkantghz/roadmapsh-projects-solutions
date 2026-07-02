import { Url } from "../models/Url.js";
import { Click } from "../models/Click.js";
import { Counter } from "../models/Counter.js";
import { encodeBase62 } from "../utils/base62.js";
import { redisClient } from "../config/redis.js";
import { AppError } from "../utils/AppError.js";
import { IUrl, AnalyticsPayload, FilterQueries } from "../types/url.js";

const CACHE_TTL = 86400; // 24 Hours

/**
 * 🟢 Generates a shortened URL linked securely to the authenticated user.
 */
export async function createShortUrl(
  originalUrl: string,
  customAlias: string | undefined,
  extraFields: Partial<Pick<IUrl, "tags" | "isFavorite" | "password" | "expiresAt">> = {},
  userId: string // ◄── Injected owner context
): Promise<IUrl> {
  
  // Case A: User requested a Custom Alias
  if (customAlias) {
    const aliasCollision = await Url.findOne({ shortCode: customAlias });
    if (aliasCollision) {
      throw new AppError("⚠️ This custom alias is already taken. Try another one.", 400);
    }

    const urlRecord = await Url.create({
      originalUrl,
      shortCode: customAlias,
      createdBy: userId, // ◄── Set owner reference
      ...extraFields,
    });
    
    await redisClient.setEx(`url:${customAlias}`, CACHE_TTL, originalUrl);
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
      createdBy: userId, // ◄── Check if THIS user already shortened it
      isArchived: false,
      password: null,
      expiresAt: null,
    });
    
    if (existingUrl) {
      await redisClient.setEx(`url:${existingUrl.shortCode}`, CACHE_TTL, existingUrl.originalUrl);
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

  const urlRecord = await Url.create({
    originalUrl,
    shortCode,
    createdBy: userId, // ◄── Set owner reference
    ...extraFields,
  });
  
  await redisClient.setEx(`url:${shortCode}`, CACHE_TTL, originalUrl);
  return urlRecord;
}

/**
 * 🟢 Retrieves links matching specific search/filter criteria belonging strictly to the request context owner.
 */
export async function getUserUrls(userId: string, filters: FilterQueries) {
  // 🔐 Always isolate queries to the current user's profile dataset
  const queryCondition: any = { createdBy: userId, isArchived: false };

  if (filters.search) {
    queryCondition.$text = { $search: filters.search };
  }
  if (filters.tag) {
    queryCondition.tags = filters.tag;
  }
  if (typeof filters.isFavorite === "boolean") {
    queryCondition.isFavorite = filters.isFavorite;
  }

  const skipRows = (filters.page - 1) * filters.limit;

  const [links, totalRecords] = await Promise.all([
    Url.find(queryCondition)
      .sort({ createdAt: -1 })
      .skip(skipRows)
      .limit(filters.limit)
      .lean(),
    Url.countDocuments(queryCondition),
  ]);

  return {
    links,
    pagination: {
      total: totalRecords,
      page: filters.page,
      limit: filters.limit,
      pages: Math.ceil(totalRecords / filters.limit),
    },
  };
}

/**
 * 🌐 Core Public Redirection Router Target Resolution (Remains open to the public web)
 */
export async function getShortUrlTarget(shortCode: string): Promise<string | null> {
  const cacheKey = `url:${shortCode}`;
  try {
    const cachedUrl = await redisClient.get(cacheKey);
    if (cachedUrl) return cachedUrl;

    const urlRecord = await Url.findOne({ shortCode, isArchived: false });
    if (!urlRecord) return null;

    if (urlRecord.expiresAt && new Date() > urlRecord.expiresAt) {
      return null;
    }

    await redisClient.setEx(cacheKey, CACHE_TTL, urlRecord.originalUrl);
    return urlRecord.originalUrl;
  } catch (error) {
    console.error(`❌ Cache/DB read failure for code [${shortCode}]:`, error);
    const fallbackRecord = await Url.findOne({ shortCode, isArchived: false });
    if (fallbackRecord && fallbackRecord.expiresAt && new Date() > fallbackRecord.expiresAt) {
      return null;
    }
    return fallbackRecord ? fallbackRecord.originalUrl : null;
  }
}

/**
 * 📊 Public Metrics ingestion execution framework
 */
export async function recordClickMetrics(shortCode: string, analytics: AnalyticsPayload): Promise<void> {
  try {
    const urlRecord = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { returnDocument: "after" },
    );
    if (!urlRecord) return;

    await Click.create({ urlId: urlRecord._id, shortCode, ...analytics });
  } catch (error) {
    console.error(`⚠️ Background Analytics Engine Failure [${shortCode}]:`, error);
  }
}

/**
 * 📈 Aggregates high-performance deep analytics parameters for dashboards
 */
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
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
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

/**
 * 🟢 Update an asset safely ensuring ownership boundaries are respected
 */
export async function updateUrlAsset(
  id: string,
  userId: string, // ◄── Injected owner context
  updateData: Partial<Pick<IUrl, "tags" | "isFavorite" | "password" | "expiresAt">>
): Promise<IUrl | null> {
  // 🔐 Must match both the _id AND the createdBy fields to succeed
  return await Url.findOneAndUpdate(
    { _id: id, createdBy: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
}

/**
 * 🟢 Toggles long term storage archive setting securely and clears hot Redis cache paths
 */
export async function toggleArchiveStatus(id: string, userId: string, isArchived: boolean): Promise<IUrl | null> {
  const urlRecord = await Url.findOneAndUpdate(
    { _id: id, createdBy: userId }, // 🔐 Boundary constraint matching
    { $set: { isArchived } },
    { new: true }
  );

  if (urlRecord) {
    await redisClient.del(`url:${urlRecord.shortCode}`);
  }
  return urlRecord;
}

/**
 * 🟢 Permanent single asset removal verifying authorization parameters
 */
export async function permanentDeleteUrl(id: string, userId: string): Promise<boolean> {
  const urlRecord = await Url.findOneAndDelete({ _id: id, createdBy: userId }); // 🔐 Boundary constraint
  if (!urlRecord) return false;

  await redisClient.del(`url:${urlRecord.shortCode}`);
  return true;
}

/**
 * 🟢 Batched document delete routines validating owner authorization across selected targets
 */
export async function bulkDeleteUrls(ids: string[], userId: string): Promise<{ deletedCount: number }> {
  // 1. Only find records that actually belong to this user out of the incoming array
  const targetRecords = await Url.find(
    { _id: { $in: ids }, createdBy: userId },
    "shortCode"
  ).lean();
  
  if (targetRecords.length === 0) {
    return { deletedCount: 0 };
  }

  const cacheKeys = targetRecords.map((rec) => `url:${rec.shortCode}`);

  // 2. Clear only the user's matched entries out of the Mongo DB cluster layer
  const result = await Url.deleteMany({
    _id: { $in: targetRecords.map(r => r._id) }
  });

  // 3. Clean up the key values out of the hot Redis cache cluster layer
  if (cacheKeys.length > 0) {
    await redisClient.del(cacheKeys);
  }

  return { deletedCount: result.deletedCount };
}