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
  createComment,
  deleteComment,
  getComments,
  replyToComment,
  updateComment,
} from "../controllers/commentController.js";

import { validate } from "../middleware/validate.js";
import verifyJWT from "../middleware/verifyJWT.js";

import {
  createArticleSchema,
  updateArticleSchema,
  updateArticleStatusSchema,
} from "../validators/articleValidator.js";
import requireVerifiedUser from "../middleware/requireVerifiedUser.js";
import validateObjectId from "../middleware/validateObjectId.js";
import { commentSchema } from "../validators/commentValidator.js";

const router = express.Router();

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create article
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: JWT Authentication in Node
 *               content:
 *                 type: array
 *                 example:
 *                   - type: paragraph
 *                     text: JWT authentication explanation
 *               category:
 *                 type: string
 *                 example: security
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - jwt
 *                   - nodejs
 *     responses:
 *       201:
 *         description: Article created successfully
 */
router.post(
  "/articles",
  verifyJWT,
  requireVerifiedUser,
  validate(createArticleSchema),
  createArticle,
);

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all published articles
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: security
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         example: jwt
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         example: authentication
 *     responses:
 *       200:
 *         description: Articles fetched successfully
 */
router.get("/articles", getAllArticles);

/**
 * @swagger
 * /articles/me:
 *   get:
 *     summary: Get logged-in user's articles
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User articles fetched successfully
 */
router.get("/articles/me", verifyJWT, getMyArticles);

/**
 * @swagger
 * /articles/trending:
 *   get:
 *     summary: Get trending articles
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Trending articles fetched successfully
 */
router.get("/articles/trending", getTrendingArticles);

/**
 * @swagger
 * /articles/bookmarks:
 *   get:
 *     summary: Get bookmarked articles
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookmarks fetched successfully
 */
router.get("/articles/bookmarks", verifyJWT, getBookmarks);

/**
 * @swagger
 * /articles/{slug}/analytics:
 *   get:
 *     summary: Get article analytics
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: jwt-authentication-in-node
 *     responses:
 *       200:
 *         description: Analytics fetched successfully
 */
router.get("/articles/:slug/analytics", verifyJWT, getArticleAnalytics);

/**
 * @swagger
 * /articles/{id}/recommended:
 *   get:
 *     summary: Get recommended articles
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recommended articles fetched successfully
 */
router.get("/articles/:id/recommended", getRecommendedArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get single article
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article fetched successfully
 */
router.get("/articles/:slug", getSingleArticle);
/**
 * @swagger
 * /articles/{id}/status:
 *   patch:
 *     summary: Change article status
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - draft
 *                   - published
 *                   - archived
 *                 example: published
 *     responses:
 *       200:
 *         description: Article status updated successfully
 */
router.patch(
  "/articles/:id/status",
  verifyJWT,
  validateObjectId(),
  validate(updateArticleStatusSchema),
  changeArticleStatus,
);

/**
 * @swagger
 * /articles/{id}/comments:
 *   post:
 *     summary: Add comment to article
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Great article!
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post(
  "/articles/:id/comments",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  validate(commentSchema),
  createComment,
);

/**
 * @swagger
 * /articles/{id}/comments:
 *   get:
 *     summary: Get article comments
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 */
router.get("/articles/:id/comments", getComments);

/**
 * @swagger
 * /comments/{id}/reply:
 *   post:
 *     summary: Reply to comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: I agree!
 *     responses:
 *       201:
 *         description: Reply added successfully
 */
router.post(
  "/comments/:id/reply",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  validate(commentSchema),
  replyToComment,
);
/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.patch(
  "/comments/:id",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  validate(commentSchema),
  updateComment,
);
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete(
  "/comments/:id",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  deleteComment,
);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Update article
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated JWT Guide
 *               content:
 *                 type: array
 *                 example:
 *                   - type: paragraph
 *                     text: Updated content here
 *               category:
 *                 type: string
 *                 example: security
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - jwt
 *                   - auth
 *     responses:
 *       200:
 *         description: Article updated successfully
 */
router.put(
  "/articles/:id",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  validate(updateArticleSchema),
  updateArticle,
);

router.post(
  "/articles/:id/like",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  likeArticle,
);

router.post(
  "/articles/:id/dislike",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  dislikeArticle,
);

router.post(
  "/articles/:id/bookmark",
  verifyJWT,
  requireVerifiedUser,
  validateObjectId(),
  toggleBookmark,
);
router.delete("/articles/:id", verifyJWT, validateObjectId(), deleteArticle);

export default router;
