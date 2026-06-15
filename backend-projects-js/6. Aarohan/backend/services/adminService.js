import User from "../models/User.js";
import Article from "../models/Article.js";

import ApiError from "../utils/ApiError.js";
import Comment from "../models/Comment.js";

export const getDashboardMetricsService = async () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalArticles,
    newUsersToday,
    articlesToday,
    lockedAccounts,
    totalViews,
    trendingArticles,
    latestUsers,
    latestArticles,
  ] = await Promise.all([
    User.countDocuments(),

    // Keep all articles for admin
    Article.countDocuments(),

    User.countDocuments({
      createdAt: {
        $gte: today,
      },
    }),

    Article.countDocuments({
      createdAt: {
        $gte: today,
      },
    }),

    User.countDocuments({
      lockUntil: {
        $gt: new Date(),
      },
    }),

    // Count only published article views
    Article.aggregate([
      {
        $match: {
          status: "published",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$views",
          },
        },
      },
    ]),

    // Trending published articles
    Article.find({
      status: "published",
    })
      .sort({
        views: -1,
      })
      .limit(5)
      .select(
        `
      title
      views
      category
      createdAt
    `,
      )
      .lean(),

    // Latest users
    User.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        `
      name
      email
      createdAt
    `,
      )
      .lean(),

    // Latest published articles
    Article.find({
      status: "published",
    })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        `
      title
      category
      createdAt
    `,
      )
      .lean(),
  ]);

  return {
    totalUsers,
    totalArticles,
    newUsersToday,
    articlesToday,
    lockedAccounts,

    totalViews: totalViews[0]?.total || 0,

    trendingArticles,

    latestUsers,

    latestArticles,
  };
};

export const getAllUsersService = async ({
  page,
  limit,
  search,
  verified,
  locked,
}) => {
  const skip = (page - 1) * limit;

  const filter = {
    ...(search && {
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }),

    ...(verified !== undefined && {
      isVerified: verified === "true",
    }),

    ...(locked === "true" && {
      lockUntil: {
        $gt: new Date(),
      },
    }),

    ...(locked === "false" && {
      $or: [
        {
          lockUntil: null,
        },
        {
          lockUntil: {
            $lte: new Date(),
          },
        },
      ],
    }),
  };

  const totalUsers = await User.countDocuments(filter);

  const users = await User.find(filter)
    .select(
      `
      name
      email
      role
      isVerified
      failedLoginAttempts
      lockUntil
      createdAt
    `,
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    users,

    totalUsers,

    totalPages: Math.max(1, Math.ceil(totalUsers / limit)),

    currentPage: page,
  };
};

export const toggleUserLockService = async (userId, adminId, action) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // prevent self lock
  if (user._id.toString() === adminId.toString()) {
    throw new ApiError(403, "You cannot lock your own account");
  }

  if (action === "lock") {
    user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  if (action === "unlock") {
    user.lockUntil = null;
  }

  await user.save();

  return {
    userId: user._id,
    email: user.email,
    isLocked: !!user.lockUntil,
    lockUntil: user.lockUntil,
  };
};

export const updateUserRoleService = async (userId, adminId, role) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.accountStatus === "banned") {
    throw new ApiError(403, "Cannot change role of banned user");
  }

  // prevent self role update
  if (user._id.toString() === adminId.toString()) {
    throw new ApiError(403, "You cannot change your own role");
  }

  user.role = role;

  await user.save();

  return {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
};

export const updateUserStatusService = async (userId, adminId, status) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // prevent self moderation
  if (user._id.toString() === adminId.toString()) {
    throw new ApiError(403, "You cannot update your own status");
  }

  user.accountStatus = status;

  await user.save();

  return {
    userId: user._id,
    email: user.email,
    accountStatus: user.accountStatus,
  };
};

export const deleteUserService = async (userId, adminId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(403, "Cannot delete another admin account");
  }

  // prevent self delete
  if (user._id.toString() === adminId.toString()) {
    throw new ApiError(403, "You cannot delete your own account");
  }

  await User.findByIdAndDelete(userId);

  return null;
};

export const updateArticleStatusService = async (articleId, status) => {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  article.status = status;

  await article.save();

  return {
    articleId: article._id,
    title: article.title,
    status: article.status,
  };
};

export const getAllArticlesService = async (
  page = 1,
  limit = 10,
  search,
  status,
  category,
) => {
  limit = Math.min(Number(limit), 50);

  const skip = (page - 1) * limit;

  const filter = {
    ...(search && {
      title: {
        $regex: search,
        $options: "i",
      },
    }),

    ...(status && {
      status,
    }),

    ...(category && {
      category: {
        $regex: category,
        $options: "i",
      },
    }),
  };

  const totalArticles = await Article.countDocuments(filter);

  const articles = await Article.find(filter)
    .populate("author", "name email")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .select(
      `
          title
          slug
          category
          status
          views
          createdAt
        `,
    )
    .lean();

  return {
    articles,
    totalArticles,

    totalPages: Math.ceil(totalArticles / limit) || 1,

    currentPage: Number(page),
  };
};

export const deleteArticleService = async (articleId) => {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Delete related comments
  await Comment.deleteMany({
    article: articleId,
  });

  // Delete article
  await Article.findByIdAndDelete(articleId);

  return null;
};
