// get /articles/{id}/comments

/**
 * @swagger
 * /articles/{id}/comments:
 *   post:
 *     summary: Add comment to article
 *     description: |
 *       Add a comment to an article.
 *
 *       Features:
 *       - Supports authenticated users only
 *       - Creates top-level comment
 *       - Automatically links comment to article
 *       - Stores comment author details
 *       - Supports nested replies later
 *
 *       Authorization required.
 *
 *       Rules:
 *       - Only verified users can comment
 *       - Article must exist
 *       - Content is required
 *
 *     tags:
 *       - Comments
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *
 *           examples:
 *
 *             AddComment:
 *               summary: Add a new comment
 *               value:
 *                 content: Great article on React!
 *
 *     responses:
 *
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 201
 *               message: Comment added successfully
 *               data:
 *                 article: 6a293106832b481cf34ea391
 *
 *                 user:
 *                   _id: 6a266642a4888c94e625dcd4
 *                   name: Pankaj
 *
 *                 content: Great article on React!
 *
 *                 isDeleted: false
 *
 *                 deletedAt: null
 *
 *                 parentComment: null
 *
 *                 _id: 6a296c596ec670d5e93c58c3
 *
 *                 createdAt: 2026-06-10T13:53:29.056Z
 *
 *                 updatedAt: 2026-06-10T13:53:29.056Z
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
 *             examples:
 *
 *               Unauthorized:
 *                 summary: No token
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
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// get /articles/{id}/comments:

/**
 * @swagger
 * /articles/{id}/comments:
 *   get:
 *     summary: Get article comments
 *     description: |
 *       Fetch all comments for a specific article.
 *
 *       Features:
 *       - Returns top-level comments
 *       - Includes nested replies
 *       - Sorted by newest comments first
 *       - Replies sorted oldest first
 *       - Soft deleted comments excluded
 *
 *       Public endpoint.
 *
 *       Rules:
 *       - Article ID must be valid
 *       - Returns empty array if no comments exist
 *       - Deleted comments are hidden
 *
 *     tags:
 *       - Comments
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
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *
 *             examples:
 *
 *               CommentsWithReplies:
 *                 summary: Article comments with replies
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Comments fetched successfully
 *                   data:
 *                     - _id: 6a296c596ec670d5e93c58c3
 *
 *                       article: 6a293106832b481cf34ea391
 *
 *                       user:
 *                         _id: 6a266642a4888c94e625dcd4
 *                         name: Pankaj
 *
 *                       content: Updated helpful article!
 *
 *                       isDeleted: false
 *
 *                       deletedAt: null
 *
 *                       parentComment: null
 *
 *                       createdAt: 2026-06-10T13:53:29.056Z
 *
 *                       updatedAt: 2026-06-10T14:04:20.756Z
 *
 *                       replies:
 *                         - _id: 6a296e106ec670d5e93c58c4
 *
 *                           article: 6a293106832b481cf34ea391
 *
 *                           user:
 *                             _id: 6a266642a4888c94e625dcd4
 *                             name: Pankaj
 *
 *                           content: I agree with this
 *
 *                           isDeleted: false
 *
 *                           deletedAt: null
 *
 *                           parentComment: 6a296c596ec670d5e93c58c3
 *
 *                           createdAt: 2026-06-10T14:00:48.166Z
 *
 *                           updatedAt: 2026-06-10T14:00:48.166Z
 *
 *               NoComments:
 *                 summary: No comments found
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Comments fetched successfully
 *                   data: []
 *
 *       400:
 *         description: Invalid article ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid article ID
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// POST /comments/:id/reply

/**
 * @swagger
 * /comments/{id}/reply:
 *   post:
 *     summary: Reply to a comment
 *     description: |
 *       Add a reply to an existing comment.
 *
 *       Features:
 *       - Supports nested comment replies
 *       - Automatically links reply to parent comment
 *       - Inherits article reference from parent comment
 *       - Stores reply author details
 *
 *       Authorization required.
 *
 *       Rules:
 *       - Only verified users can reply
 *       - Parent comment must exist
 *       - Content is required
 *
 *     tags:
 *       - Comments
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
 *         description: Parent comment ID
 *         example: 6a296c596ec670d5e93c58c3
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *
 *           examples:
 *
 *             ReplyComment:
 *               summary: Add reply to comment
 *               value:
 *                 content: I agree with this
 *
 *     responses:
 *
 *       201:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 201
 *               message: Reply added successfully
 *               data:
 *                 article: 6a293106832b481cf34ea391
 *
 *                 user:
 *                   _id: 6a266642a4888c94e625dcd4
 *                   name: Pankaj
 *
 *                 content: I agree with this
 *
 *                 isDeleted: false
 *
 *                 deletedAt: null
 *
 *                 parentComment: 6a296c596ec670d5e93c58c3
 *
 *                 _id: 6a296e106ec670d5e93c58c4
 *
 *                 createdAt: 2026-06-10T14:00:48.166Z
 *
 *                 updatedAt: 2026-06-10T14:00:48.166Z
 *
 *       400:
 *         description: Invalid comment ID
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
 *             examples:
 *
 *               Unauthorized:
 *                 summary: No token
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
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Comment not found
 */

// patch /comments/{id}:

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     description: |
 *       Update an existing comment.
 *
 *       Features:
 *       - Only comment owner can update
 *       - Updates comment content
 *       - Automatically updates updatedAt timestamp
 *
 *       Authorization required.
 *
 *       Rules:
 *       - Users can update only their own comments
 *       - Admin cannot update other users' comments
 *       - Comment must exist
 *       - Content is required
 *
 *     tags:
 *       - Comments
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
 *         description: Comment ID
 *         example: 6a296c596ec670d5e93c58c3
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *
 *           examples:
 *
 *             UpdateComment:
 *               summary: Update comment content
 *               value:
 *                 content: Updated helpful article!
 *
 *     responses:
 *
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Comment updated successfully
 *               data:
 *                 _id: 6a296c596ec670d5e93c58c3
 *
 *                 article: 6a293106832b481cf34ea391
 *
 *                 user: 6a266642a4888c94e625dcd4
 *
 *                 content: Updated helpful article!
 *
 *                 isDeleted: false
 *
 *                 deletedAt: null
 *
 *                 parentComment: null
 *
 *                 createdAt: 2026-06-10T13:53:29.056Z
 *
 *                 updatedAt: 2026-06-10T14:04:20.756Z
 *
 *       400:
 *         description: Invalid comment ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid comment ID
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             examples:
 *
 *               Unauthorized:
 *                 summary: No token
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
 *       403:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: You are not authorized
 *
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Comment not found
 */

// delete /comments/{id}
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: |
 *       Soft delete a comment.
 *
 *       Features:
 *       - Performs soft delete
 *       - Sets isDeleted to true
 *       - Stores deleted timestamp
 *       - Comment is hidden from future fetches
 *
 *       Authorization required.
 *
 *       Rules:
 *       - Comment owner can delete
 *       - Admin can delete any comment
 *       - Other users are not authorized
 *       - Comment must exist
 *
 *     tags:
 *       - Comments
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
 *         description: Comment ID
 *         example: 6a296c596ec670d5e93c58c3
 *
 *     responses:
 *
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Comment deleted successfully
 *               data: null
 *
 *       400:
 *         description: Invalid comment ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid comment ID
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             examples:
 *
 *               Unauthorized:
 *                 summary: No token
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
 *       403:
 *         description: User is not authorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: You are not authorized
 *
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Comment not found
 */


