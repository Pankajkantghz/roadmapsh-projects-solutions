// post article

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     description: Create a draft article with structured content blocks.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *
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
 *                 example: Node.js Rate Limiting express
 *
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *                 example:
 *                   - type: heading
 *                     level: 1
 *                     text: Rate Limiting
 *                   - type: paragraph
 *                     text: Rate limiting protects APIs from spam and abuse.
 *
 *               category:
 *                 type: string
 *                 example: backend
 *
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - nodejs
 *                   - security
 *
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *
 *                 message:
 *                   type: string
 *                   example: Article created successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6a21487725b6456ed5aca6a8
 *
 *                     title:
 *                       type: string
 *                       example: Node.js Rate Limiting express
 *
 *                     slug:
 *                       type: string
 *                       example: nodejs-rate-limiting-express
 *
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *
 *                     excerpt:
 *                       type: string
 *                       example: Rate limiting protects APIs from spam and abuse.
 *
 *                     category:
 *                       type: string
 *                       example: backend
 *
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - nodejs
 *                         - security
 *
 *                     author:
 *                       type: string
 *                       example: 6a2026ea8e327928c8ef0d1f
 *
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *
 *                     dislikes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *
 *                     views:
 *                       type: number
 *                       example: 0
 *
 *                     status:
 *                       type: string
 *                       example: draft
 *
 *                     readingTime:
 *                       type: string
 *                       example: 1 min read
 *
 *                     publishedAt:
 *                       nullable: true
 *                       example: null
 *
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 success: false
 *                 errors:
 *                   - Title is required
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               example:
 *                 success: false
 *                 message: Unauthorized access
 */

// get articles

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all published articles
 *     description: |
 *       Fetch paginated published articles with support for:
 *
 *       - Pagination
 *       - Category filtering
 *       - Tag filtering
 *       - Full-text search
 *       - Sorting
 *
 *       Only published articles are returned.
 *       Draft and archived articles are excluded.
 *
 *     tags:
 *       - Articles
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of articles per page
 *         example: 10
 *
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by category (case insensitive)
 *         example: backend
 *
 *       - in: query
 *         name: tag
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter articles by tag
 *         example: nodejs
 *
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search articles by title, content, tags, or category
 *         example: jwt authentication
 *
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *         description: Sort articles by created date
 *         example: newest
 *
 *     responses:
 *
 *       200:
 *         description: Articles fetched successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               SuccessfulResponse:
 *                 summary: Successful fetch
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Articles fetched successfully
 *                   data:
 *                     articles:
 *                       - _id: 6a2153b22e08db5bcecde111
 *
 *                         title: Node.js Rate Limiting
 *
 *                         excerpt: Rate limiting protects APIs from spam and abuse.
 *
 *                         category: backend
 *
 *                         tags:
 *                           - nodejs
 *                           - security
 *
 *                         author:
 *                           _id: 6a2026ea8e327928c8ef0d1f
 *                           name: Pankaj
 *
 *                         views: 0
 *
 *                         readingTime: 1 min read
 *
 *                         publishedAt: 2026-06-04T10:33:21.520Z
 *
 *                         createdAt: 2026-06-04T10:30:10.109Z
 *
 *                         slug: nodejs-rate-limiting
 *
 *                         totalLikes: 0
 *
 *                     totalArticles: 1
 *                     totalPages: 1
 *                     currentPage: 1
 *
 *               EmptyResponse:
 *                 summary: No matching articles found
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Articles fetched successfully
 *                   data:
 *                     articles: []
 *                     totalArticles: 0
 *                     totalPages: 1
 *                     currentPage: 1
 *
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid request parameters
 */

// get articles/me

/**
 * @swagger
 * /articles/me:
 *   get:
 *     summary: Get logged-in user's articles
 *     description: |
 *       Fetch all articles created by the currently logged-in user.
 *
 *       Features:
 *       - Returns only current user's articles
 *       - Includes draft, published, and archived articles
 *       - Sorted by newest first
 *       - Optimized for dashboard / My Articles page
 *       - Includes article engagement metrics
 *
 *       Authorization required.
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: My articles fetched successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               ArticlesFound:
 *                 summary: User has articles
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: My articles fetched successfully
 *                   data:
 *                     - _id: 6a27a493bbc4a506db0a7f15
 *
 *                       title: Delete Testing Article
 *
 *                       excerpt: This article is created for testing delete permissions.
 *
 *                       category: testing
 *
 *                       tags:
 *                         - nodejs
 *                         - testing
 *                         - delete
 *
 *                       views: 0
 *
 *                       status: draft
 *
 *                       readingTime: 1 min read
 *
 *                       publishedAt: null
 *
 *                       createdAt: 2026-06-09T05:28:51.253Z
 *
 *                       updatedAt: 2026-06-09T05:35:20.000Z
 *
 *                       slug: delete-testing-article
 *
 *                       totalLikes: 0
 *
 *                       totalDislikes: 0
 *
 *               NoArticles:
 *                 summary: User has no articles
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: My articles fetched successfully
 *                   data: []
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized access
 *
 *       403:
 *         description: Email verification required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Please verify your email first
 */

// get articles/trending

/**
 * @swagger
 * /articles/trending:
 *   get:
 *     summary: Get trending articles
 *     description: |
 *       Fetch trending published articles ranked using engagement metrics.
 *
 *       Ranking factors include:
 *       - Likes
 *       - Comments
 *       - Views
 *       - Recency boost
 *       - Dislikes penalty
 *
 *       Supports period filtering.
 *
 *     tags:
 *       - Articles
 *
 *     parameters:
 *       - in: query
 *         name: period
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - today
 *             - week
 *             - month
 *           default: today
 *         description: Filter trending articles by time period
 *         example: today
 *
 *     responses:
 *
 *       200:
 *         description: Trending articles fetched successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               TrendingArticlesFound:
 *                 summary: Trending articles found
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Trending articles fetched successfully
 *                   data:
 *                     - _id: 6a290357feaeebcb3b100ba4
 *                       title: Delete Test Article
 *                       slug: delete-test-article
 *                       excerpt: This article is created for testing delete permissions.
 *                       category: testing
 *                       tags:
 *                         - nodejs
 *                         - testing
 *                         - delete
 *                       author:
 *                         _id: 6a266642a4888c94e625dcd4
 *                         name: Pankaj
 *                       views: 0
 *                       readingTime: 1 min read
 *                       totalLikes: 1
 *                       totalDislikes: 0
 *                       totalComments: 1
 *                       trendingScore: 25.97
 *                       createdAt: 2026-06-10T06:25:27.836Z
 *
 *               EmptyResponse:
 *                 summary: No trending articles found
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Trending articles fetched successfully
 *                   data: []
 *
 *       400:
 *         description: Invalid period
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid period. Allowed values: today, week, month"
 */

// get /articles/{slug}/analytics

/**
 * @swagger
 * /articles/{slug}/analytics:
 *   get:
 *     summary: Get article analytics
 *     description: |
 *       Fetch analytics for a specific article.
 *
 *       Features:
 *       - Returns engagement metrics
 *       - Includes views, likes, dislikes, comments
 *       - Calculates engagement rate
 *       - Supports draft and published articles
 *
 *       Authorization required.
 *
 *       Rules:
 *       - Article owner can view analytics
 *       - Admin can view analytics
 *       - Other users are not authorized
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique article slug
 *         example: delete-test-article
 *
 *     responses:
 *
 *       200:
 *         description: Analytics fetched successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               PublishedArticleAnalytics:
 *                 summary: Analytics for published article
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Analytics fetched successfully
 *                   data:
 *                     title: Delete Test Article
 *                     slug: delete-test-article
 *                     views: 25
 *                     likes: 10
 *                     dislikes: 2
 *                     comments: 5
 *                     engagementRate: "60.00%"
 *
 *               DraftArticleAnalytics:
 *                 summary: Analytics for draft article
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Analytics fetched successfully
 *                   data:
 *                     title: Delete Test Arti
 *                     slug: delete-test-arti-1
 *                     views: 0
 *                     likes: 0
 *                     dislikes: 0
 *                     comments: 0
 *                     engagementRate: "N/A"
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized access
 *
 *       403:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: You are not authorized
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// get articles/{id}/recommended

/**
 * @swagger
 * /articles/{id}/recommended:
 *   get:
 *     summary: Get recommended articles
 *     description: |
 *       Fetch recommended published articles based on:
 *
 *       - Same category
 *       - Similar tags
 *
 *       Features:
 *       - Excludes current article
 *       - Returns only published articles
 *       - Sorted by views descending
 *       - Limited to maximum 5 articles
 *       - Optimized lightweight response
 *
 *     tags:
 *       - Articles
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *         example: 6a29301a832b481cf34ea38e
 *
 *     responses:
 *
 *       200:
 *         description: Recommended articles fetched successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               RecommendationsFound:
 *                 summary: Matching recommended articles found
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Recommended articles fetched successfully
 *                   data:
 *                     - _id: 6a293068832b481cf34ea38f
 *                       title: MongoDB Aggregation Pipeline
 *                       slug: mongodb-aggregation-pipeline
 *                       excerpt: Learn aggregation pipeline in MongoDB.
 *                       category: backend
 *                       tags:
 *                         - mongodb
 *                         - database
 *                       views: 0
 *                       readingTime: 1 min read
 *                       createdAt: 2026-06-10T09:37:44.903Z
 *
 *                     - _id: 6a2930a4832b481cf34ea390
 *                       title: Express Middleware Deep Dive
 *                       slug: express-middleware-deep-dive
 *                       excerpt: Understanding Express middleware in Node.js.
 *                       category: server
 *                       tags:
 *                         - nodejs
 *                         - middleware
 *                       views: 0
 *                       readingTime: 1 min read
 *                       createdAt: 2026-06-10T09:38:44.656Z
 *
 *               NoRecommendations:
 *                 summary: No matching articles found
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Recommended articles fetched successfully
 *                   data: []
 *
 *       400:
 *         description: Invalid article ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid article ID
 */

// patch /articles/{id}/status

/**
 * @swagger
 * /articles/{id}/status:
 *   patch:
 *     summary: Change article status
 *     description: |
 *       Change the status of an article.
 *
 *       Supported statuses:
 *       - draft
 *       - published
 *       - archived
 *
 *       Features:
 *       - Only article owner can update status
 *       - Email verification required
 *       - Publishing sets publishedAt automatically
 *       - Archived articles become hidden from public routes
 *       - Draft articles remain private
 *
 *       Authorization required.
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *         example: 6a2153b22e08db5bcecde111
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *
 *           examples:
 *
 *             PublishArticle:
 *               summary: Publish article
 *               value:
 *                 status: published
 *
 *             ArchiveArticle:
 *               summary: Archive article
 *               value:
 *                 status: archived
 *
 *             MoveToDraft:
 *               summary: Move article to draft
 *               value:
 *                 status: draft
 *
 *     responses:
 *
 *       200:
 *         description: Article status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Article status updated successfully
 *               data:
 *                 _id: 6a2153b22e08db5bcecde111
 *                 title: Express Rate Limiting
 *                 slug: express-rate-limiting
 *                 status: published
 *                 publishedAt: 2026-06-08T10:33:21.520Z
 *                 updatedAt: 2026-06-08T10:40:00.000Z
 *
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             examples:
 *
 *               InvalidStatus:
 *                 summary: Invalid status
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Invalid status value
 *
 *               InvalidObjectId:
 *                 summary: Invalid article ID
 *                 value:
 *                   success: false
 *                   message: Invalid article id
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized access
 *
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             examples:
 *
 *               UnauthorizedUser:
 *                 summary: User not owner
 *                 value:
 *                   success: false
 *                   message: You are not authorized
 *
 *               UnverifiedUser:
 *                 summary: Email not verified
 *                 value:
 *                   success: false
 *                   message: Please verify your email first
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// get /articles/{slug}

/**
 * @swagger
 * /articles/{slug}:
 *   get:
 *     summary: Get a single published article
 *     description: |
 *       Fetch a single published article using its unique slug.
 *
 *       Features:
 *       - Fetch full article content
 *       - Auto increments article views
 *       - Returns author information
 *       - Includes metadata like reading time and publish date
 *       - Returns likes/dislikes counts
 *
 *       Only published articles are accessible.
 *       Draft and archived articles are hidden.
 *
 *     tags:
 *       - Articles
 *
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique article slug
 *         example: nodejs-rate-limiting
 *
 *     responses:
 *
 *       200:
 *         description: Article fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Article fetched successfully
 *               data:
 *                 _id: 6a2153b22e08db5bcecde111
 *
 *                 title: Node.js Rate Limiting
 *
 *                 content:
 *                   - type: heading
 *                     level: 1
 *                     text: Rate Limiting
 *
 *                   - type: paragraph
 *                     text: Rate limiting protects APIs from spam and abuse.
 *
 *                 excerpt: Rate limiting protects APIs from spam and abuse.
 *
 *                 category: backend
 *
 *                 tags:
 *                   - nodejs
 *                   - security
 *
 *                 author:
 *                   _id: 6a2026ea8e327928c8ef0d1f
 *                   name: Pankaj
 *
 *                 views: 5
 *
 *                 status: published
 *
 *                 readingTime: 1 min read
 *
 *                 publishedAt: 2026-06-04T10:33:21.520Z
 *
 *                 createdAt: 2026-06-04T10:30:10.109Z
 *
 *                 updatedAt: 2026-06-07T22:26:08.169Z
 *
 *                 slug: nodejs-rate-limiting
 *
 *                 totalLikes: 0
 *
 *                 totalDislikes: 0
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 *
 *       400:
 *         description: Invalid URL parameter
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid URL parameter
 */

// delete /articles/{id}

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     description: |
 *       Delete an article by its ID.
 *
 *       Authorization required.
 *
 *       Rules:
 *       - Article owner can delete their own article
 *       - Admin can delete any article
 *       - Other users cannot delete someone else's article
 *
 *       Similar to YouTube ownership model.
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *         example: 6a2153b22e08db5bcecde111
 *
 *     responses:
 *
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Article deleted successfully
 *               data: null
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized access
 *
 *       403:
 *         description: User is not authorized to delete this article
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: You are not authorized
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 *
 *       400:
 *         description: Invalid article ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid article id
 */

// patch /articles/{id}

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Update an article
 *     description: |
 *       Update an existing article.
 *
 *       Features:
 *       - Only article owner can update
 *       - Partial updates supported
 *       - Slug auto updates when title changes
 *       - Reading time recalculates if content changes
 *       - Excerpt auto updates
 *
 *       Authorization required.
 *
 *       Rules:
 *       - Users can only update their own articles
 *       - Admin cannot update other users' articles
 *       - Similar to YouTube ownership model
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *         example: 6a2153b22e08db5bcecde111
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *
 *           examples:
 *
 *             UpdateTitle:
 *               summary: Update article title
 *               value:
 *                 title: Express Rate Limiting
 *
 *             UpdateCategory:
 *               summary: Update category only
 *               value:
 *                 category: security
 *
 *             UpdateMultipleFields:
 *               summary: Update multiple fields
 *               value:
 *                 title: Advanced Express Rate Limiting
 *                 category: backend
 *                 tags:
 *                   - nodejs
 *                   - express
 *                   - security
 *
 *     responses:
 *
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Article updated successfully
 *               data:
 *                 _id: 6a2153b22e08db5bcecde111
 *
 *                 title: Express Rate Limiting
 *
 *                 content:
 *                   - type: heading
 *                     level: 1
 *                     text: Rate Limiting
 *
 *                   - type: paragraph
 *                     text: Rate limiting protects APIs from spam and abuse.
 *
 *                 excerpt: Rate limiting protects APIs from spam and abuse.
 *
 *                 category: security
 *
 *                 tags:
 *                   - nodejs
 *                   - security
 *
 *                 author:
 *                   _id: 6a2026ea8e327928c8ef0d1f
 *                   name: Pankaj
 *
 *                 views: 6
 *
 *                 status: published
 *
 *                 readingTime: 1 min read
 *
 *                 publishedAt: 2026-06-04T10:33:21.520Z
 *
 *                 createdAt: 2026-06-04T10:30:10.109Z
 *
 *                 updatedAt: 2026-06-08T06:00:37.405Z
 *
 *                 slug: express-rate-limiting
 *
 *                 totalLikes: 0
 *
 *                 totalDislikes: 0
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized access
 *
 *       403:
 *         description: User is not authorized to update this article
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: You are not authorized
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// post /articles/{id}/like

/**
 * @swagger
 * /articles/{id}/like:
 *   post:
 *     summary: Like or unlike an article
 *     description: |
 *       Toggle like on an article.
 *
 *       Features:
 *       - First request adds like
 *       - Second request removes like (toggle)
 *       - Automatically removes dislike if present
 *       - Returns updated reaction state
 *
 *       Authorization required.
 *       Verified account required.
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *         example: 6a293106832b481cf34ea391
 *
 *     responses:
 *
 *       200:
 *         description: Like toggled successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               LikeAdded:
 *                 summary: Article liked
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Article liked successfully
 *                   data:
 *                     likes: 1
 *                     dislikes: 0
 *                     isLiked: true
 *                     isDisliked: false
 *
 *               LikeRemoved:
 *                 summary: Like removed
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Like removed successfully
 *                   data:
 *                     likes: 0
 *                     dislikes: 0
 *                     isLiked: false
 *                     isDisliked: false
 *
 *       400:
 *         description: Invalid article ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid article ID
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized access
 *
 *       403:
 *         description: Email verification required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Please verify your email first
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// post /articles/{id}/dislike

/**
 * @swagger
 * /articles/{id}/dislike:
 *   post:
 *     summary: Dislike or remove dislike from an article
 *     description: |
 *       Toggle dislike on an article.
 *
 *       Features:
 *       - First request adds dislike
 *       - Second request removes dislike (toggle)
 *       - Automatically removes like if present
 *       - Returns updated reaction state
 *
 *       Authorization required.
 *       Verified account required.
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *         example: 6a293106832b481cf34ea391
 *
 *     responses:
 *
 *       200:
 *         description: Dislike toggled successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               DislikeAdded:
 *                 summary: Article disliked
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Article disliked successfully
 *                   data:
 *                     likes: 0
 *                     dislikes: 1
 *                     isLiked: false
 *                     isDisliked: true
 *
 *               DislikeRemoved:
 *                 summary: Dislike removed
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Dislike removed successfully
 *                   data:
 *                     likes: 0
 *                     dislikes: 0
 *                     isLiked: false
 *                     isDisliked: false
 *
 *       400:
 *         description: Invalid article ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid article ID
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized access
 *
 *       403:
 *         description: Email verification required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Please verify your email first
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// post /articles/{id}/bookmark

/**
 * @swagger
 * /articles/{id}/bookmark:
 *   post:
 *     summary: Bookmark or remove bookmark from an article
 *     description: |
 *       Toggle bookmark status for an article.
 *
 *       Features:
 *       - First request bookmarks the article
 *       - Second request removes bookmark (toggle behavior)
 *       - Stores bookmarks per authenticated user
 *       - Returns updated bookmark state
 *       - Returns updated total bookmark count
 *       - Only published articles can be bookmarked
 *
 *       Requirements:
 *       - Authorization required
 *       - Verified account required
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *         example: 6a293106832b481cf34ea391
 *
 *     responses:
 *
 *       200:
 *         description: Bookmark toggled successfully
 *         content:
 *           application/json:
 *             examples:
 *
 *               ArticleBookmarked:
 *                 summary: Article bookmarked successfully
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Article bookmarked successfully
 *                   data:
 *                     isBookmarked: true
 *                     totalBookmarks: 1
 *
 *               BookmarkRemoved:
 *                 summary: Bookmark removed successfully
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Bookmark removed successfully
 *                   data:
 *                     isBookmarked: false
 *                     totalBookmarks: 0
 *
 *       400:
 *         description: Invalid article ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid articleId ID
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             examples:
 *
 *               MissingToken:
 *                 summary: No access token
 *                 value:
 *                   success: false
 *                   message: Unauthorized access
 *
 *               InvalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *
 *               ExpiredToken:
 *                 summary: Expired token
 *                 value:
 *                   success: false
 *                   message: Token expired
 *
 *       403:
 *         description: Email verification required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Please verify your email first
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// get  /articles/bookmarks:

/**
 * @swagger
 * /articles/bookmarks:
 *   get:
 *     summary: Get bookmarked articles
 *     description: |
 *       Fetch all bookmarked articles of the currently authenticated user.
 *
 *       Features:
 *       - Returns only current user's bookmarks
 *       - Returns only published articles
 *       - Hidden, blocked, or draft articles are excluded
 *       - Lightweight optimized response
 *       - Includes engagement metrics
 *       - Includes article metadata
 *
 *       Requirements:
 *       - Authorization required
 *       - Verified account required
 *
 *     tags:
 *       - Articles
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Bookmarks fetched successfully
 *         content:
 *           application/json:
 *             examples:
 *
 *               BookmarksFound:
 *                 summary: User has bookmarks
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Bookmarks fetched successfully
 *                   data:
 *                     - _id: 6a28fb83a3f112980374495b
 *                       title: Delete Testing Article
 *                       slug: delete-testing-article-1
 *                       excerpt: This article is created for testing delete permissions.
 *                       category: testing
 *                       tags:
 *                         - nodejs
 *                         - testing
 *                         - delete
 *                       views: 0
 *                       status: published
 *                       readingTime: 1 min read
 *                       publishedAt: null
 *                       createdAt: 2026-06-10T05:52:03.052Z
 *                       updatedAt: 2026-06-10T05:53:33.302Z
 *                       totalLikes: 0
 *                       totalDislikes: 0
 *
 *               NoBookmarks:
 *                 summary: User has no bookmarks
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Bookmarks fetched successfully
 *                   data: []
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             examples:
 *
 *               MissingToken:
 *                 summary: No access token
 *                 value:
 *                   success: false
 *                   message: Unauthorized access
 *
 *               InvalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *
 *               ExpiredToken:
 *                 summary: Expired token
 *                 value:
 *                   success: false
 *                   message: Token expired
 *
 *       403:
 *         description: Email verification required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Please verify your email first
 */
