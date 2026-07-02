import { Request, Response } from "express";
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

export const createUrlHandler = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { originalUrl, customAlias, tags, isFavorite, password, expiresAt } =
      req.body;

    const userId = req.user!.id;

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

    const userId = req.user!.id;

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
    const { shortCode } = req.params;
    const { password } = req.body || {};

    const urlRecord = await Url.findOne({ shortCode, isArchived: false });

    if (!urlRecord) {
      throw new AppError(
        "The request shortened link does not exist or has expired",
        400,
      );
    }

    if (urlRecord.expiresAt && new Date() > urlRecord.expiresAt) {
      throw new AppError("This link asset has officially expired", 410);
    }

    if (urlRecord.password) {
      // Scenario A: No password passed in req.body
      if (password === undefined || password === null || password === "") {
        res.status(200).json({
          success: false,
          passwordRequired: true,
          message:
            "Lockscreen challenge initialized. This URL requires verification data.",
        });
        return;
      }

      // Scenario B: Password passed but doesn't match
      if (urlRecord.password !== password) {
        throw new AppError(
          "Incorrect password provided for this link asset.",
          403,
        );
      }
    }

    const parser = new UAParser(req.headers["user-agent"] || "");
    const uaResults = parser.getResult();

    const analyticsMetadata = {
      browser: uaResults.browser.name || "Unknown Browser",
      os: uaResults.os.name || "Unknown OS",
      device: uaResults.device.type || "Desktop",
      referrer: req.get("referrer") || "Direct Link",
    };

    recordClickMetrics(shortCode, analyticsMetadata);

    res.redirect(urlRecord.originalUrl);
    return;
  },
);

export const getUrlAnalyticsData = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { shortCode } = req.params;
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
    const { id } = req.params;
    const { tags, isFavorite, password, expiresAt } = req.body;
    const userId = req.user!.id;

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
    const { id } = req.params;

    const { isArchived } = req.body || {};
    const userId = req.user!.id;

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
    const { id } = req.params;

    const userId = req.user!.id;
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
    const userId = req.user!.id;

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
