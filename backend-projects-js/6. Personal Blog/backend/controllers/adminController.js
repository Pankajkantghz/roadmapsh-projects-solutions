import User from "../models/User.js";
import Article from "../models/Article.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();

  const totalArticles = await Article.countDocuments();

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const newUsersToday = await User.countDocuments({
    createdAt: {
      $gte: today,
    },
  });

  const articlesToday = await Article.countDocuments({
    createdAt: {
      $gte: today,
    },
  });

  const lockedAccounts = await User.countDocuments({
    lockUntil: {
      $gt: new Date(),
    },
  });

  const totalViews = await Article.aggregate([
    {
      $group: {
        _id: null,

        total: {
          $sum: "$views",
        },
      },
    },
  ]);

  const trendingArticles = await Article.find()
    .sort({
      views: -1,
    })
    .limit(5)
    .select("title views category createdAt");

  const latestUsers = await User.find()
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .select("name email createdAt");

  const latestArticles = await Article.find()
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .select("title category createdAt");

  res
    .status(200)

    .json(
      new ApiResponse(
        200,

        {
          totalUsers,
          totalArticles,
          newUsersToday,
          articlesToday,
          lockedAccounts,

          totalViews: totalViews[0]?.total || 0,

          trendingArticles,

          latestUsers,

          latestArticles,
        },

        "Dashboard metrics fetched successfully",
      ),
    );
});
