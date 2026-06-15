import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";

import adminOnly from "../middleware/adminOnly.js";

import {
  getDashboardMetrics,
  getAllUsers,
  toggleUserLock,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  updateArticleStatus,
  getAllArticles,
  deleteArticle,
} from "../controllers/adminController.js";
import validateObjectId from "../middleware/validateObjectId.js";
import {
  updateUserRoleSchema,
  updateUserStatusSchema,
  userLockSchema,
  adminUpdateArticleStatusSchema,
} from "../validators/adminValidator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/users", verifyJWT, adminOnly, getAllUsers);

router.get("/dashboard", verifyJWT, adminOnly, getDashboardMetrics);

router.patch(
  "/users/:id/lock",
  verifyJWT,
  adminOnly,
  validateObjectId("user"),
  validate(userLockSchema),
  toggleUserLock,
);

router.patch(
  "/users/:id/role",
  verifyJWT,
  adminOnly,
  validateObjectId("user"),
  validate(updateUserRoleSchema),
  updateUserRole,
);

router.patch(
  "/users/:id/status",
  verifyJWT,
  adminOnly,
  validateObjectId("user"),
  validate(updateUserStatusSchema),
  updateUserStatus,
);

router.delete(
  "/users/:id",
  verifyJWT,
  adminOnly,
  validateObjectId("user"),
  deleteUser,
);

router.patch(
  "/articles/:id/status",
  verifyJWT,
  adminOnly,
  validateObjectId("article"),
  validate(adminUpdateArticleStatusSchema),
  updateArticleStatus,
);

router.delete(
  "/articles/:id",
  verifyJWT,
  adminOnly,
  validateObjectId("article"),
  deleteArticle,
);

router.get("/articles", verifyJWT, adminOnly, getAllArticles);
export default router;
