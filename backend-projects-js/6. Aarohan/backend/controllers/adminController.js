import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

import {
  getDashboardMetricsService,
  getAllUsersService,
  toggleUserLockService,
  updateUserRoleService,
  updateUserStatusService,
  deleteUserService,
  updateArticleStatusService,
  getAllArticlesService,
  deleteArticleService,
} from "../services/adminService.js";

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await getDashboardMetricsService();

  res
    .status(200)
    .json(
      new ApiResponse(200, metrics, "Dashboard metrics fetched successfully"),
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const search = req.query.search || "";

  const verified = req.query.verified;

  const locked = req.query.locked;

  const users = await getAllUsersService({
    page,
    limit,
    search,
    verified,
    locked,
  });

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const toggleUserLock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const user = await toggleUserLockService(id, req.user._id, action);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        action === "lock"
          ? "User locked successfully"
          : "User unlocked successfully",
      ),
    );
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await updateUserRoleService(id, req.user._id, role);

  res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const user = await updateUserStatusService(id, req.user._id, status);

  const statusMessages = {
    active: "User account activated successfully",

    suspended: "User suspended successfully",

    banned: "User banned successfully",
  };

  res.status(200).json(new ApiResponse(200, user, statusMessages[status]));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteUserService(id, req.user._id);

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

export const updateArticleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const article = await updateArticleStatusService(id, status);

  const statusMessages = {
    published: "Article published successfully",

    draft: "Article moved to draft successfully",

    hidden: "Article hidden successfully",

    blocked: "Article blocked successfully",
  };

  res.status(200).json(new ApiResponse(200, article, statusMessages[status]));
});

export const getAllArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, category } = req.query;

  const articles = await getAllArticlesService(
    Number(page),
    Number(limit),
    search,
    status,
    category,
  );

  res
    .status(200)
    .json(new ApiResponse(200, articles, "Articles fetched successfully"));
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteArticleService(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Article deleted successfully"));
});
