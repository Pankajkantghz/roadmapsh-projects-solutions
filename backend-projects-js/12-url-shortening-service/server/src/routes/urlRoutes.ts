import { Router } from "express";
import { validate } from "../validators/index.js";
import {
  shortenUrlSchema,
  redirectSchema,
  getUrlsQuerySchema,
} from "../validators/urlValidator.js";
import {
  createUrlHandler,
  getUrlsDashboardHandler,
  redirectShortUrl,
  getUrlAnalyticsData,
  updateUrlHandler,
  toggleArchiveHandler,
  deleteUrlHandler,
  bulkDeleteHandler,
} from "../controllers/urlController.js";

const router = Router();

// 1. Collection Operations & Feeds (Static/Query paths)
router.post("/", validate(shortenUrlSchema), createUrlHandler);
router.get("/", validate(getUrlsQuerySchema), getUrlsDashboardHandler);
router.post("/bulk-delete", bulkDeleteHandler); // ◄── Placed above :id to prevent path collision

// 2. Specific Asset Management Operations (Resource ID paths)
router.patch("/:id", updateUrlHandler);
router.patch("/:id/archive", toggleArchiveHandler);
router.delete("/:id", deleteUrlHandler);

// 3. High-Speed Metrics Readout (ShortCode paths)
router.get(
  "/:shortCode/analytics",
  validate(redirectSchema),
  getUrlAnalyticsData,
);
router.get("/:shortCode", validate(redirectSchema), redirectShortUrl);

export default router;
