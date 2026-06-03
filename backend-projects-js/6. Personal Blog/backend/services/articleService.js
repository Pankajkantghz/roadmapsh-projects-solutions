import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import ApiError from "../utils/ApiError.js";

export const createArticleService = async (data) => {
  const article = await Article.create({
    ...data,
    tags: data.tags || [],
  });
  return article;
};

export const getAllArticlesService = async (
  page,

  limit,

  category,

  sort,

  tag,

  q,
) => {
  const skip = (page - 1) * limit;

  //
  // Filter Object
  //
  const filter = {
    status: "published",
    ...(category && {
      category: {
        $regex: category,

        $options: "i",
      },
    }),

    ...(tag && {
      tags: {
        $in: [
          new RegExp(
            tag,

            "i",
          ),
        ],
      },
    }),

    ...(q && {
      $text: {
        $search: q,
      },
    }),
  };

  //
  // Sort Option
  //
  const sortOption =
    sort === "oldest"
      ? {
          createdAt: 1,
        }
      : {
          createdAt: -1,
        };

  //
  // Total Count
  //
  const totalArticles = await Article.countDocuments(filter);

  //
  // Fetch Pagination Data
  //

  const articles = await Article.find(filter)

    .select(
      `
  title
  slug
  category
  tags
  views
  readingTime
  createdAt
  publishedAt
  `,
    )
    .populate("author", "name")

    .sort(sortOption)

    .skip(skip)

    .limit(limit)

    .lean();

  return {
    articles,

    totalArticles,

    totalPages: Math.ceil(totalArticles / limit),

    currentPage: page,
  };
};

export const getSingleArticleService = async (id) => {
  const article = await Article.findOne({
    slug: id,

    status: "published",
  })

    .populate("author", "name email")

    .select("-__v");

  if (!article) {
    return null;
  }

  article.views = (article.views || 0) + 1;

  await article.save();

  return article;
};

export const updateArticleService = async (id, data, userId) => {
  const article = await Article.findById(id);

  if (!article) {
    return null;
  }

  const isOwner = article.author.toString() === userId.toString();

  if (!isOwner) {
    throw new ApiError(403, "You are not authorized");
  }

  return await Article.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .select("-__v")
    .lean();
};

export const deleteArticleService = async (id, userId, role) => {
  const article = await Article.findById(id);

  if (!article) {
    return null;
  }

  const isOwner = article.author.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized");
  }

  return await Article.findByIdAndDelete(id).select("-__v").lean();
};

export const getMyArticlesService = async (userId) => {
  const articles = await Article.find({ author: userId })
    .select("-__v")
    .sort({ createdAt: -1 })
    .lean();

  return articles;
};

export const getTrendingArticlesService = async (period = "today") => {
  const date = new Date();

  if (period === "today") {
    date.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    date.setDate(date.getDate() - 7);
  } else if (period === "month") {
    date.setMonth(date.getMonth() - 1);
  }

  const articles = await Article.find({
    createdAt: {
      $gte: date,
    },
  });

  const trending = articles.map((article) => {
    const likes = article.likes?.length || 0;

    const dislikes = article.dislikes?.length || 0;

    const views = article.views || 0;

    const hoursOld =
      (Date.now() - new Date(article.createdAt)) / (1000 * 60 * 60);

    const freshness = Math.max(20 - hoursOld * 0.5, 0);

    const trendingScore = Number(
      (likes * 4 + views * 0.3 - dislikes * 3 + freshness).toFixed(2),
    );

    return {
      _id: article._id,

      title: article.title,

      content: article.content,

      category: article.category,

      tags: article.tags,

      author: article.author,

      views: views,

      totalLikes: likes,

      totalDislikes: dislikes,

      trendingScore,

      createdAt: article.createdAt,
    };
  });

  return trending
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 10);
};

export const getRecommendedArticlesService = async (id) => {
  const currentArticle = await Article.findById(id);

  if (!currentArticle) {
    return [];
  }

  const articles = await Article.find({
    _id: {
      $ne: id,
    },

    $or: [
      {
        category: currentArticle.category,
      },

      {
        tags: {
          $in: currentArticle.tags,
        },
      },
    ],
  })

    .select("title category tags views createdAt")

    .sort({
      views: -1,
    })

    .limit(5);

  return articles;
};

export const changeArticleStatusService = async (id, status, userId) => {
  const article = await Article.findById(id);

  if (!article) {
    return null;
  }

  const isOwner = article.author.toString() === userId.toString();

  if (!isOwner) {
    throw new ApiError(403, "You are not authorized");
  }

  article.status = status;

  if (status === "published") {
    article.publishedAt = new Date();
  }

  await article.save();

  return article;
};

export const getArticleAnalyticsService = async (slug, userId, role) => {
  const article = await Article.findOne({
    slug,
  });

  if (!article) {
    return null;
  }

  const isOwner = article.author.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized");
  }

  const commentCount = await Comment.countDocuments({
    article: article._id,

    isDeleted: {
      $ne: true,
    },
  });

  const likes = article.likes?.length || 0;

  const dislikes = article.dislikes?.length || 0;

  const views = article.views || 0;

  const engagementRate = views > 0 ? ((likes + commentCount) / views) * 100 : 0;

  return {
    title: article.title,

    slug: article.slug,

    views,

    likes,

    dislikes,

    comments: commentCount,

    engagementRate: `${engagementRate.toFixed(2)}%`,
  };
};
