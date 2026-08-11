import { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import {
  createShortUrl,
  getShortUrlTarget,
  recordClickMetrics,
  getUrlAnalytics,
  getUserUrls,
  toggleArchiveStatus,
  permanentDeleteUrl,
  bulkDeleteUrls,
  updateUrlAsset,
} from "../services/urlService.js";
import { Url } from "../models/Url.js";
import { generateQrCodeDataUrl } from "../utils/qrGenerator.js";
import { redisClient } from "../config/redis.js";

// Helper to safely resolve user ID regardless of mongoose _id vs id property
const getUserId = (req: Request): string => {
  const user = req.user as any;
  if (!user) throw new AppError("Unauthorized access.", 401);
  return user.id || user._id?.toString();
};

export const createUrlHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { originalUrl, customAlias, tags, isFavorite, password, expiresAt } =
      req.body;

    const userId = getUserId(req);

    const urlRecord = await createShortUrl(
      originalUrl,
      customAlias,
      {
        tags,
        isFavorite,
        password,
        expiresAt,
      },
      userId,
    );

    const rawHost = req.get("host") || "localhost:5000";
    const cleanHost = Array.isArray(rawHost) ? rawHost[0] : rawHost;
    const baseDomain = process.env.BASE_URL || `${req.protocol}://${cleanHost}`;
    const shortUrl = `${baseDomain}/${urlRecord.shortCode}`;

    const qrCodeDataUrl = await generateQrCodeDataUrl(shortUrl);

    res.status(201).json({
      success: true,
      message: "Short URL asset created successfully.",
      data: {
        id: urlRecord._id,
        originalUrl: urlRecord.originalUrl,
        shortCode: urlRecord.shortCode,
        shortUrl,
        qrCode: qrCodeDataUrl,
        clicks: urlRecord.clicks,
        tags: urlRecord.tags,
        isFavorite: urlRecord.isFavorite,
        expiresAt: urlRecord.expiresAt,
        createdAt: urlRecord.createdAt,
      },
    });
  },
);

export const getUrlsDashboardHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { search, tag, isFavorite, page, limit } = req.query as any;
    const userId = getUserId(req);

    const dashboardData = await getUserUrls(userId, {
      search,
      tag,
      isFavorite,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard portfolio metrics retrieved successfully.",
      data: dashboardData,
    });
  },
);

export const redirectShortUrl = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { shortCode: rawShortCode } = req.params;
    const shortCode = Array.isArray(rawShortCode)
      ? rawShortCode[0]
      : rawShortCode;

    if (!shortCode) {
      throw new AppError("Invalid link format parameter requested.", 400);
    }
    const { password } = req.body || {};

    let targetUrl: string | null = null;
    let urlRecord: any = null;

    if (redisClient?.isOpen) {
      targetUrl = await redisClient.get(`url-cache:${shortCode}`);
    }

    if (targetUrl) {
      res.redirect(targetUrl);
      processBackgroundMetrics(req, shortCode);
      return;
    }

    urlRecord = await Url.findOne({ shortCode, isArchived: false });

    if (!urlRecord) {
      throw new AppError(
        "The requested shortened link does not exist or has been archived.",
        404,
      );
    }

    if (urlRecord.expiresAt && new Date() > urlRecord.expiresAt) {
      throw new AppError("This link asset has officially expired.", 410);
    }

    if (urlRecord.password) {
      if (!password) {
        res.status(200).json({
          success: false,
          passwordRequired: true,
          message:
            "Lockscreen challenge initialized. This URL requires verification data.",
        });
        return;
      }

      if (urlRecord.password !== password) {
        throw new AppError(
          "Incorrect password provided for this link asset.",
          403,
        );
      }
    }

    if (redisClient?.isOpen && !urlRecord.password) {
      await redisClient.setEx(
        `url-cache:${shortCode}`,
        86400,
        urlRecord.originalUrl,
      );
    }

    res.redirect(urlRecord.originalUrl);
    processBackgroundMetrics(req, shortCode);
    return;
  },
);

function processBackgroundMetrics(req: Request, shortCode: string): void {
  const parser = new UAParser(req.headers["user-agent"] || "");
  const uaResults = parser.getResult();

  const analyticsMetadata = {
    browser: uaResults.browser.name || "Unknown Browser",
    os: uaResults.os.name || "Unknown OS",
    device: uaResults.device.type || "Desktop",
    referrer: req.get("referrer") || "Direct Link",
  };

  recordClickMetrics(shortCode, analyticsMetadata).catch((err) => {
    console.error(
      `Non-blocking analytics registration failure for code [${shortCode}]:`,
      err,
    );
  });
}

export const getUrlAnalyticsData = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { shortCode } = req.params as { shortCode: string };
    const analyticsData = await getUrlAnalytics(shortCode);

    if (!analyticsData) {
      throw new AppError(
        "🌐 Analytical metrics not found for this code resource.",
        404,
      );
    }

    res.status(200).json({
      success: true,
      message: "Analytical data metrics retrieved successfully.",
      data: analyticsData,
    });
  },
);

export const updateUrlHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { tags, isFavorite, password, expiresAt } = req.body;
    const userId = getUserId(req);

    const updatedRecord = await updateUrlAsset(id, userId, {
      tags,
      isFavorite,
      password,
      expiresAt,
    });
    if (!updatedRecord) {
      throw new AppError(
        "The target URL asset profile could not be found.",
        404,
      );
    }

    res.status(200).json({
      success: true,
      message: "Short URL asset configuration updated successfully.",
      data: updatedRecord,
    });
  },
);

export const toggleArchiveHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const { isArchived } = req.body || {};
    const userId = getUserId(req);

    if (typeof isArchived !== "boolean") {
      throw new AppError(
        "A boolean 'isArchived' property is required in the request body.",
        400,
      );
    }

    const updatedRecord = await toggleArchiveStatus(id, userId, isArchived);
    if (!updatedRecord) {
      throw new AppError(
        "The target URL asset profile could not be found.",
        404,
      );
    }

    res.status(200).json({
      success: true,
      message: isArchived
        ? "URL safely moved to long-term archive storage."
        : "URL asset successfully restored to active runtime matrix.",
      data: updatedRecord,
    });
  },
);

export const deleteUrlHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const userId = getUserId(req);
    const isDeleted = await permanentDeleteUrl(id, userId);

    if (!isDeleted) {
      throw new AppError(
        "The target URL asset profile could not be found.",
        404,
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Short link and cache indexes fully deleted from live cluster environments.",
    });
  },
);

export const bulkDeleteHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { ids } = req.body;
    const userId = getUserId(req);

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(
        "An array containing target ID references must be supplied.",
        400,
      );
    }

    const executionResult = await bulkDeleteUrls(ids, userId);

    res.status(200).json({
      success: true,
      message: `Batch transaction processed. Purged ${executionResult.deletedCount} items completely.`,
      data: executionResult,
    });
  },
);

export const checkAliasAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { alias } = req.params;

    const cachedUrl = await redisClient.get(`url:${alias}`);
    if (cachedUrl) {
      return res.status(200).json({
        available: false,
        message: "Alias is already taken.",
      });
    }

    const existingUrl = await Url.findOne({ shortCode: alias });
    if (existingUrl) {
      return res.status(200).json({
        available: false,
        message: "Alias is already taken.",
      });
    }

    return res.status(200).json({
      available: true,
      message: "Alias is available!",
    });
  } catch (error) {
    next(error);
  }
};