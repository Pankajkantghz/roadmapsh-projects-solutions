import { Url } from "../models/Url.js";
import { Click } from "../models/Click.js";
import { Counter } from "../models/Counter.js";
import { encodeBase62 } from "../utils/base62.js";
import { redisClient } from "../config/redis.js";
import { AppError } from "../utils/AppError.js";
import { IUrl, AnalyticsPayload, FilterQueries } from "../types/url.js";

const CACHE_TTL = 86400; // 24 Hours

export async function createShortUrl(
  originalUrl: string,
  customAlias?: string,
  extraFields: Partial<
    Pick<IUrl, "tags" | "isFavorite" | "password" | "expiresAt">
  > = {},
): Promise<IUrl> {
  if (customAlias) {
    const aliasCollision = await Url.findOne({ shortCode: customAlias });
    if (aliasCollision) {
      throw new AppError(
        "⚠️ This custom alias is already taken. Try another one.",
        400,
      );
    }

    const urlRecord = await Url.create({
      originalUrl,
      shortCode: customAlias,
      ...extraFields,
    });
    await redisClient.setEx(`url:${customAlias}`, CACHE_TTL, originalUrl);
    return urlRecord;
  }

  const isPlainLink =
    !extraFields.tags?.length &&
    !extraFields.isFavorite &&
    !extraFields.password &&
    !extraFields.expiresAt;
  if (isPlainLink) {
    const existingUrl = await Url.findOne({
      originalUrl,
      isArchived: false,
      password: null,
      expiresAt: null,
    });
    if (existingUrl) {
      await redisClient.setEx(
        `url:${existingUrl.shortCode}`,
        CACHE_TTL,
        existingUrl.originalUrl,
      );
      return existingUrl;
    }
  }

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
    ...extraFields,
  });
  await redisClient.setEx(`url:${shortCode}`, CACHE_TTL, originalUrl);

  return urlRecord;
}

export async function getUserUrls(filters: FilterQueries) {
  const queryCondition: any = { isArchived: false };

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

export async function getShortUrlTarget(
  shortCode: string,
): Promise<string | null> {
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
    if (
      fallbackRecord &&
      fallbackRecord.expiresAt &&
      new Date() > fallbackRecord.expiresAt
    ) {
      return null;
    }
    return fallbackRecord ? fallbackRecord.originalUrl : null;
  }
}

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
      `⚠️ Background Analytics Engine Failure [${shortCode}]:`,
      error,
    );
  }
}

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

export async function updateUrlAsset(
  id: string,
  updateData: Partial<
    Pick<IUrl, "tags" | "isFavorite" | "password" | "expiresAt">
  >,
): Promise<IUrl | null> {
  return await Url.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );
}

export async function toggleArchiveStatus(
  id: string,
  isArchived: boolean,
): Promise<IUrl | null> {
  const urlRecord = await Url.findByIdAndUpdate(
    id,
    { $set: { isArchived } },
    { new: true },
  );

  if (urlRecord) {
    await redisClient.del(`url:${urlRecord.shortCode}`);
  }
  return urlRecord;
}

export async function permanentDeleteUrl(id: string): Promise<boolean> {
  const urlRecord = await Url.findByIdAndDelete(id);
  if (!urlRecord) return false;

  await redisClient.del(`url:${urlRecord.shortCode}`);
  return true;
}

export async function bulkDeleteUrls(
  ids: string[],
): Promise<{ deletedCount: number }> {
  // Find profiles first to execute a safe cache purge sequence across the cluster
  const targetRecords = await Url.find(
    { _id: { $in: ids } },
    "shortCode",
  ).lean();
  const cacheKeys = targetRecords.map((rec) => `url:${rec.shortCode}`);

  const result = await Url.deleteMany({ _id: { $in: ids } });

  if (cacheKeys.length > 0) {
    await redisClient.del(cacheKeys);
  }

  return { deletedCount: result.deletedCount };
}
