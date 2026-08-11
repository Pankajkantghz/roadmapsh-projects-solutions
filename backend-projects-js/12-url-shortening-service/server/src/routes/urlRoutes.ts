import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../validators/index.js";
import {
  shortenUrlSchema,
  redirectSchema,
  getUrlsQuerySchema,
  updateUrlSchema,
  bulkDeleteSchema,
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
  checkAliasAvailability,
} from "../controllers/urlController.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Dedicated Rate Limiters
const createUrlLimiter = rateLimiter({
  windowSizeInSeconds: 60,
  maxRequests: 10,
  endpointName: "url-creation",
});

const redirectLimiter = rateLimiter({
  windowSizeInSeconds: 60,
  maxRequests: 120,
  endpointName: "url-redirection",
});

const analyticsLimiter = rateLimiter({
  windowSizeInSeconds: 60,
  maxRequests: 30,
  endpointName: "url-analytics",
});

// 1. Create Short URL (Auth checked before Zod validation)
router.post(
  "/",
  createUrlLimiter,
  protect,
  validate(shortenUrlSchema),
  createUrlHandler,
);

// 2. Get Dashboard URLs List
router.get(
  "/",
  protect,
  validate(getUrlsQuerySchema),
  getUrlsDashboardHandler,
);

// 3. Bulk Delete URLs
router.post(
  "/bulk-delete",
  protect,
  validate(bulkDeleteSchema),
  bulkDeleteHandler,
);

// 4. Individual URL Actions
router.patch(
  "/:id",
  protect,
  validate(updateUrlSchema),
  updateUrlHandler,
);

router.patch(
  "/:id/archive",
  protect,
  toggleArchiveHandler,
);

router.delete(
  "/:id",
  protect,
  deleteUrlHandler,
);

// 5. Analytics Endpoint
router.get(
  "/:shortCode/analytics",
  analyticsLimiter,
  validate(redirectSchema),
  getUrlAnalyticsData,
);

// 6. Password Verification Endpoint (Explicit API route)
router.post(
  "/:shortCode/verify-password",
  redirectLimiter,
  validate(redirectSchema),
  redirectShortUrl,
);

router.get(
  "/check-alias/:alias",
  protect,
  checkAliasAvailability,
);

export default router;