// GET /admin/dashboard

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard metrics
 *
 *     description: |
 *       Fetch admin dashboard analytics and platform statistics.
 *
 *       Features:
 *       - Admin only access
 *       - Total users count
 *       - Total articles count
 *       - New users registered today
 *       - Articles created today
 *       - Locked accounts count
 *       - Total article views
 *       - Top trending articles
 *       - Latest registered users
 *       - Latest published articles
 *
 *       Useful for building:
 *       - Admin panel
 *       - Analytics dashboard
 *       - Platform monitoring
 *
 *     tags:
 *       - Admin
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Dashboard metrics fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Dashboard metrics fetched successfully
 *               data:
 *                 totalUsers: 6
 *                 totalArticles: 5
 *                 newUsersToday: 0
 *                 articlesToday: 0
 *                 lockedAccounts: 0
 *                 totalViews: 0
 *
 *                 trendingArticles:
 *                   - _id: 6a29301a832b481cf34ea38e
 *                     title: Node.js Authentication Guide
 *                     category: backend
 *                     views: 0
 *                     createdAt: 2026-06-10T09:36:26.552Z
 *
 *                 latestUsers:
 *                   - _id: 6a28fe98f4e22aa38de91444
 *                     name: Pankaj
 *                     email: pankaj@gmail.com
 *                     createdAt: 2026-06-10T06:05:12.344Z
 *
 *                 latestArticles:
 *                   - _id: 6a293106832b481cf34ea391
 *                     title: React State Management
 *                     category: frontend
 *                     createdAt: 2026-06-10T09:40:22.127Z
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
 *         description: Admin access required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Admin access only
 */

// get /admin/users:
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *
 *     description: |
 *       Fetch all registered users with pagination, search, and filters.
 *
 *       Features:
 *       - Admin only access
 *       - Pagination supported
 *       - Search by name or email
 *       - Filter verified users
 *       - Filter locked users
 *       - Sorted by newest users first
 *
 *       Query Parameters:
 *       - `page` → Page number
 *       - `limit` → Number of users per page (max 50)
 *       - `search` → Search by name or email
 *       - `verified` → true / false
 *       - `locked` → true / false
 *
 *     tags:
 *       - Admin
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Number of users per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search user by name or email
 *         example: pankaj
 *
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter verified users
 *         example: true
 *
 *       - in: query
 *         name: locked
 *         schema:
 *           type: boolean
 *         description: Filter locked users
 *         example: true
 *
 *     responses:
 *
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Users fetched successfully
 *               data:
 *                 users:
 *                   - _id: 6a28fe98f4e22aa38de91444
 *                     name: Pankaj
 *                     email: pankaj@gmail.com
 *                     role: user
 *                     lockUntil: null
 *                     isVerified: true
 *                     createdAt: 2026-06-10T06:05:12.344Z
 *
 *                 totalUsers: 6
 *                 totalPages: 1
 *                 currentPage: 1
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
 *         description: Admin access required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Admin access only
 */

// patch /admin/users/{id}/lock

/**
 * @swagger
 * /admin/users/{id}/lock:
 *   patch:
 *     summary: Lock or unlock a user account (Admin only)
 *     description: |
 *       Lock or unlock a user account using an explicit action.
 *
 *       Features:
 *       - Admin only access
 *       - Explicit lock/unlock system
 *       - Prevents admin from locking their own account
 *       - Lock duration is 24 hours
 *       - Invalid user IDs are rejected
 *
 *       Rules:
 *       - Only admins can lock or unlock users
 *       - Admin cannot lock their own account
 *       - Action must be `lock` or `unlock`
 *
 *     tags:
 *       - Admin
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
 *         description: User ID
 *         example: 6a2026ea8e327928c8ef0d1f
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum:
 *                   - lock
 *                   - unlock
 *                 example: lock
 *
 *           examples:
 *
 *             LockUser:
 *               summary: Lock a user account
 *               value:
 *                 action: lock
 *
 *             UnlockUser:
 *               summary: Unlock a user account
 *               value:
 *                 action: unlock
 *
 *     responses:
 *
 *       200:
 *         description: User lock status updated successfully
 *         content:
 *           application/json:
 *             examples:
 *
 *               UserLocked:
 *                 summary: User locked successfully
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: User locked successfully
 *                   data:
 *                     userId: 6a2026ea8e327928c8ef0d1f
 *                     email: dev.test.nita@gmail.com
 *                     isLocked: true
 *                     lockUntil: 2026-06-12T07:20:49.075Z
 *
 *               UserUnlocked:
 *                 summary: User unlocked successfully
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: User unlocked successfully
 *                   data:
 *                     userId: 6a2026ea8e327928c8ef0d1f
 *                     email: dev.test.nita@gmail.com
 *                     isLocked: false
 *                     lockUntil: null
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *
 *               MissingAction:
 *                 summary: Missing action field
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Action is required
 *
 *               InvalidAction:
 *                 summary: Invalid action
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Action must be lock or unlock
 *
 *               InvalidUserId:
 *                 summary: Invalid user ID
 *                 value:
 *                   success: false
 *                   message: Invalid user ID
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
 *         description: Forbidden action
 *         content:
 *           application/json:
 *             examples:
 *
 *               AdminOnly:
 *                 summary: Non-admin access
 *                 value:
 *                   success: false
 *                   message: Admin access only
 *
 *               SelfLock:
 *                 summary: Admin trying to lock themselves
 *                 value:
 *                   success: false
 *                   message: You cannot lock your own account
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 */

// patch /admin/users/{id}/role:

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     description: |
 *       Change a user's role.
 *
 *       Features:
 *       - Admin only access
 *       - Change user role between `user` and `admin`
 *       - Prevents admin from changing their own role
 *       - Invalid user IDs are rejected
 *
 *       Rules:
 *       - Only admins can update user roles
 *       - Admin cannot change their own role
 *       - Role must be `user` or `admin`
 *
 *     tags:
 *       - Admin
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
 *         description: User ID
 *         example: 6a2026ea8e327928c8ef0d1f
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                 example: admin
 *
 *           examples:
 *
 *             MakeAdmin:
 *               summary: Promote user to admin
 *               value:
 *                 role: admin
 *
 *             MakeUser:
 *               summary: Change admin to user
 *               value:
 *                 role: user
 *
 *     responses:
 *
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             examples:
 *
 *               UserPromoted:
 *                 summary: User promoted to admin
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: User role updated successfully
 *                   data:
 *                     userId: 6a2026ea8e327928c8ef0d1f
 *                     email: dev.test.nita@gmail.com
 *                     role: admin
 *
 *               UserDemoted:
 *                 summary: User changed to normal user
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: User role updated successfully
 *                   data:
 *                     userId: 6a2026ea8e327928c8ef0d1f
 *                     email: dev.test.nita@gmail.com
 *                     role: user
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *
 *               MissingRole:
 *                 summary: Empty request body
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Role is required
 *
 *               InvalidRole:
 *                 summary: Invalid role
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Role must be user or admin
 *
 *               InvalidUserId:
 *                 summary: Invalid user ID
 *                 value:
 *                   success: false
 *                   message: Invalid user ID
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
 *         description: Forbidden action
 *         content:
 *           application/json:
 *             examples:
 *
 *               AdminOnly:
 *                 summary: Non-admin trying to access
 *                 value:
 *                   success: false
 *                   message: Admin access only
 *
 *               SelfRoleUpdate:
 *                 summary: Admin trying to change their own role
 *                 value:
 *                   success: false
 *                   message: You cannot change your own role
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 */

// patch /admin/users/{id}/status

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user account status (Admin only)
 *     description: |
 *       Update a user's moderation status.
 *
 *       Features:
 *       - Admin only access
 *       - Supports account moderation
 *       - Prevents admin from updating their own status
 *       - Invalid user IDs are rejected
 *
 *       Available statuses:
 *       - `active` → User can access platform normally
 *       - `suspended` → User cannot create content or interact
 *       - `banned` → User is permanently blocked from platform actions
 *
 *       Rules:
 *       - Only admins can update user status
 *       - Admin cannot update their own status
 *       - Status must be `active`, `suspended`, or `banned`
 *
 *     tags:
 *       - Admin
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
 *         description: User ID
 *         example: 6a2026ea8e327928c8ef0d1f
 *
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
 *                   - active
 *                   - suspended
 *                   - banned
 *                 example: suspended
 *
 *           examples:
 *
 *             ActivateUser:
 *               summary: Activate user account
 *               value:
 *                 status: active
 *
 *             SuspendUser:
 *               summary: Suspend user account
 *               value:
 *                 status: suspended
 *
 *             BanUser:
 *               summary: Ban user account
 *               value:
 *                 status: banned
 *
 *     responses:
 *
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             examples:
 *
 *               UserSuspended:
 *                 summary: User suspended
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: User status updated successfully
 *                   data:
 *                     userId: 6a2026ea8e327928c8ef0d1f
 *                     email: dev.test.nita@gmail.com
 *                     accountStatus: suspended
 *
 *               UserBanned:
 *                 summary: User banned
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: User status updated successfully
 *                   data:
 *                     userId: 6a2026ea8e327928c8ef0d1f
 *                     email: dev.test.nita@gmail.com
 *                     accountStatus: banned
 *
 *               UserActivated:
 *                 summary: User activated
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: User status updated successfully
 *                   data:
 *                     userId: 6a2026ea8e327928c8ef0d1f
 *                     email: dev.test.nita@gmail.com
 *                     accountStatus: active
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *
 *               MissingStatus:
 *                 summary: Empty request body
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Status is required
 *
 *               InvalidStatus:
 *                 summary: Invalid status
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Status must be active, suspended, or banned
 *
 *               InvalidUserId:
 *                 summary: Invalid user ID
 *                 value:
 *                   success: false
 *                   message: Invalid user ID
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
 *         description: Forbidden action
 *         content:
 *           application/json:
 *             examples:
 *
 *               AdminOnly:
 *                 summary: Non-admin access
 *                 value:
 *                   success: false
 *                   message: Admin access only
 *
 *               SelfModeration:
 *                 summary: Admin updating own status
 *                 value:
 *                   success: false
 *                   message: You cannot update your own status
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 */

// delete /admin/users/{id}:

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user account (Admin only)
 *     description: |
 *       Permanently delete a user account.
 *
 *       Features:
 *       - Admin only access
 *       - Permanently removes user account
 *       - Prevents admin from deleting their own account
 *       - Invalid user IDs are rejected
 *
 *       Rules:
 *       - Only admins can delete users
 *       - Admin cannot delete their own account
 *       - Valid MongoDB ObjectId required
 *
 *     tags:
 *       - Admin
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
 *         description: User ID
 *         example: 6a2026ea8e327928c8ef0d1f
 *
 *     responses:
 *
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: User deleted successfully
 *               data: null
 *
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid user ID
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
 *         description: Forbidden action
 *         content:
 *           application/json:
 *             examples:
 *
 *               AdminOnly:
 *                 summary: Non-admin access
 *                 value:
 *                   success: false
 *                   message: Admin access only
 *
 *               SelfDelete:
 *                 summary: Admin trying to delete own account
 *                 value:
 *                   success: false
 *                   message: You cannot delete your own account
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User not found
 */

// Patch /admin/articles/{id}/status:

/**
 * @swagger
 * /admin/articles/{id}/status:
 *   patch:
 *     summary: Update article status (Admin only)
 *     description: |
 *       Update the moderation status of an article.
 *
 *       Features:
 *       - Admin only access
 *       - Moderate article visibility
 *       - Supports content moderation workflow
 *
 *       Available statuses:
 *       - `published` → Visible publicly
 *       - `draft` → Saved but not public
 *       - `hidden` → Hidden from public view
 *       - `blocked` → Blocked due to moderation issues
 *
 *     tags:
 *       - Admin
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
 *                   - hidden
 *                   - blocked
 *                 example: hidden
 *
 *     responses:
 *
 *       200:
 *         description: Article status updated successfully
 *         content:
 *           application/json:
 *             examples:
 *
 *               Published:
 *                 summary: Published article
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Article published successfully
 *                   data:
 *                     articleId: 6a293106832b481cf34ea391
 *                     title: React State Management
 *                     status: published
 *
 *               Draft:
 *                 summary: Draft article
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Article moved to draft successfully
 *                   data:
 *                     articleId: 6a293106832b481cf34ea391
 *                     title: React State Management
 *                     status: draft
 *
 *               Hidden:
 *                 summary: Hidden article
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Article hidden successfully
 *                   data:
 *                     articleId: 6a293106832b481cf34ea391
 *                     title: React State Management
 *                     status: hidden
 *
 *               Blocked:
 *                 summary: Blocked article
 *                 value:
 *                   success: true
 *                   statusCode: 200
 *                   message: Article blocked successfully
 *                   data:
 *                     articleId: 6a293106832b481cf34ea391
 *                     title: React State Management
 *                     status: blocked
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *
 *               MissingStatus:
 *                 summary: Empty body
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Status is required
 *
 *               InvalidStatus:
 *                 summary: Invalid status
 *                 value:
 *                   success: false
 *                   errors:
 *                     - Status must be draft, published, hidden, or blocked
 *
 *               InvalidArticleId:
 *                 summary: Invalid article ID
 *                 value:
 *                   success: false
 *                   message: Invalid article ID
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
 *         description: Admin access required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Admin access only
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

// get /admin/articles

/**
 * @swagger
 * /admin/articles:
 *   get:
 *     summary: Get all articles (Admin only)
 *     description: |
 *       Fetch all articles with pagination, search, and filters.
 *
 *       Features:
 *       - Admin only access
 *       - Pagination supported
 *       - Search by article title
 *       - Filter by article status
 *       - Filter by category
 *       - Includes author details
 *       - Sorted by newest articles first
 *
 *       Query Parameters:
 *       - `page` → Page number
 *       - `limit` → Number of articles per page (max 50)
 *       - `search` → Search by article title
 *       - `status` → draft / published / hidden / blocked
 *       - `category` → Filter by category
 *
 *     tags:
 *       - Admin
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Number of articles per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search article by title
 *         example: react
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - draft
 *             - published
 *             - hidden
 *             - blocked
 *         description: Filter by article status
 *         example: published
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: frontend
 *
 *     responses:
 *
 *       200:
 *         description: Articles fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Articles fetched successfully
 *               data:
 *                 articles:
 *                   - _id: 6a293106832b481cf34ea391
 *                     title: React State Management
 *                     slug: react-state-management
 *                     category: frontend
 *                     status: published
 *                     views: 20
 *                     createdAt: 2026-06-10T09:40:22.127Z
 *                     author:
 *                       _id: 6a266642a4888c94e625dcd4
 *                       name: Pankaj
 *                       email: pankaj@gmail.com
 *
 *                 totalArticles: 6
 *                 totalPages: 1
 *                 currentPage: 1
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
 *         description: Admin access required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Admin access only
 */

// delete /admin/articles/{id}

/**
 * @swagger
 * /admin/articles/{id}:
 *   delete:
 *     summary: Delete article (Admin only)
 *     description: |
 *       Permanently delete an article.
 *
 *       Features:
 *       - Admin only access
 *       - Permanently removes article
 *       - Deletes related comments
 *       - Invalid article IDs are rejected
 *
 *       Rules:
 *       - Only admins can delete articles
 *       - Valid MongoDB ObjectId required
 *
 *     tags:
 *       - Admin
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
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Article deleted successfully
 *               data: null
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
 *         description: Admin access required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Admin access only
 *
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Article not found
 */

