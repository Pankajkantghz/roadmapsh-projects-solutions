import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";

import adminOnly from "../middleware/adminOnly.js";
import { getDashboardMetrics } from "../controllers/adminController.js";

const router = express.Router();

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard metrics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics fetched successfully
 */
router.get("/dashboard", verifyJWT, adminOnly, getDashboardMetrics);

router.get(
  "/dashboard",

  verifyJWT,

  adminOnly,

  getDashboardMetrics,
);

export default router;
