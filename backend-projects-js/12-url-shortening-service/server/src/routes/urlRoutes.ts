import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
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
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post(
  "/",
  rateLimiter({
    windowSizeInSeconds: 60,
    maxRequests: 10,
    endpointName: "url-creation",
  }),
  protect,
  createUrlHandler,
);


router.get("/", protect, validate(getUrlsQuerySchema), getUrlsDashboardHandler);
router.post("/bulk-delete", protect, bulkDeleteHandler);

router.patch("/:id", protect, updateUrlHandler);
router.patch("/:id/archive", protect, toggleArchiveHandler);
router.delete("/:id", protect, deleteUrlHandler);

router.get(
  "/:shortCode/analytics",
  validate(redirectSchema),
  getUrlAnalyticsData,
);
router
  .route("/:shortCode")
  .get(validate(redirectSchema), redirectShortUrl)
  .post(validate(redirectSchema), redirectShortUrl);

export default router;
