
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
  "/articles",
  verifyJWT,
  requireVerifiedUser,
  validate(
    createArticleSchema,
  ),
  createArticle,
);

router.get(
  "/articles",
  getAllArticles,
);

router.get(
  "/articles/me",
  verifyJWT,
  requireVerifiedUser,
  getMyArticles,
);

router.get(
  "/articles/trending",
  getTrendingArticles,
);

router.get(
  "/articles/bookmarks",
  verifyJWT,
  requireVerifiedUser,
  getBookmarks,
);

router.get(
  "/articles/:slug/analytics",
  verifyJWT,
  getArticleAnalytics,
);

router.get(
  "/articles/:id/recommended",
  validateObjectId("articleId"),
  getRecommendedArticles,
);

router.get(
  "/articles/:slug",
  getSingleArticle,
);

router.patch(
  "/articles/:id",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  validate(
    updateArticleSchema,
  ),
  updateArticle,
);

router.patch(
  "/articles/:id/status",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  validate(
    updateArticleStatusSchema,
  ),
  changeArticleStatus,
);

router.delete(
  "/articles/:id",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  deleteArticle,
);

router.post(
  "/articles/:id/like",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  likeArticle,
);

router.post(
  "/articles/:id/dislike",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  dislikeArticle,
);

router.post(
  "/articles/:id/bookmark",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId("articleId"),
  toggleBookmark,
);

export default router;

