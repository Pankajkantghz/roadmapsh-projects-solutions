
import express from "express";

import {
  changeArticleStatus,
  createArticle,
  deleteArticle,
  dislikeArticle,
  getAllArticles,
  getArticleAnalytics,
  getBookmarks,
  getMyArticles,
  getRecommendedArticles,
  getSingleArticle,
  getTrendingArticles,
  likeArticle,
  toggleBookmark,
  updateArticle,
} from "../controllers/articleController.js";

import {
  createArticleSchema,
  updateArticleSchema,
  updateArticleStatusSchema,
} from "../validators/articleValidator.js";

import verifyJWT from "../middleware/verifyJWT.js";
import requireVerifiedUser from "../middleware/requireVerifiedUser.js";
import validateObjectId from "../middleware/validateObjectId.js";
import { validate } from "../middleware/validate.js";

const router =
  express.Router();

router.post(
  "/",
  verifyJWT,
  requireVerifiedUser,
  validate(
    createArticleSchema,
  ),
  createArticle,
);

router.get(
  "/",
  getAllArticles,
);

router.get(
  "/me",
  verifyJWT,
  requireVerifiedUser,
  getMyArticles,
);

router.get(
  "/trending",
  getTrendingArticles,
);

router.get(
  "/bookmarks",
  verifyJWT,
  requireVerifiedUser,
  getBookmarks,
);

router.get(
  "/:slug/analytics",
  verifyJWT,
  getArticleAnalytics,
);

router.get(
  "/:id/recommended",
  validateObjectId("articleId"),
  getRecommendedArticles,
);

router.get(
  "/:slug",
  getSingleArticle,
);

router.patch(
  "/:id",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  validate(
    updateArticleSchema,
  ),
  updateArticle,
);

router.patch(
  "/:id/status",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  validate(
    updateArticleStatusSchema,
  ),
  changeArticleStatus,
);

router.delete(
  "/:id",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  deleteArticle,
);

router.post(
  "/:id/like",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  likeArticle,
);

router.post(
  "/:id/dislike",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  dislikeArticle,
);

router.post(
  "/:id/bookmark",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  toggleBookmark,
);

export default router;
