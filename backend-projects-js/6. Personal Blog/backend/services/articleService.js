import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import ApiError from "../utils/ApiError.js";

const ARTICLE_SELECT_FIELDS = `
  title
  slug
  excerpt
  category
  tags
  views
  status
  readingTime
  publishedAt
  createdAt
  updatedAt
  likes
  dislikes
`;

const PUBLIC_ARTICLE_FIELDS = `
  title
  slug
  category
  tags
  views
  readingTime
  createdAt
  publishedAt
  excerpt
`;

const RECOMMENDED_ARTICLE_FIELDS = `
  title
  slug
  excerpt
  category
  tags
  views
  readingTime
  createdAt
`;

const formatArticleStats = (article) => {
  const { likes, dislikes, ...safeArticle } = article;

  return {
    ...safeArticle,

    totalLikes: likes?.length || 0,

    totalDislikes: dislikes?.length || 0,
  };
};

const validateOwnership = (article, userId, role = null) => {
  const isOwner = article.author.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized");
  }
};

export const createArticleService = async (data) =>
  Article.create({
    ...data,
    tags: data.tags || [],
  });

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

    .select(PUBLIC_ARTICLE_FIELDS)
    .populate("author", "name")

    .sort(sortOption)

    .skip(skip)

    .limit(limit)

    .lean();

  const updatedArticles = articles.map(formatArticleStats);

  return {
    articles: updatedArticles,

    totalArticles,

    totalPages: Math.max(1, Math.ceil(totalArticles / limit)),

    currentPage: page,
  };
};

export const getSingleArticleService = async (slug) => {
  const article = await Article.findOne({
    slug,

    status: "published",
  })
    .populate("author", "name")
    .select("-__v")
    .lean();

  if (!article) {
    return null;
  }

  // Increment views
  await Article.findByIdAndUpdate(article._id, {
    $inc: {
      views: 1,
    },
  });

  const formattedArticle = formatArticleStats(article);

  return {
    ...formattedArticle,

    views: article.views + 1,
  };
};

export const updateArticleService = async (id, data, userId) => {
  const article = await Article.findById(id);

  if (!article) {
    return null;
  }

  validateOwnership(article, userId);

  const allowedUpdates = ["title", "content", "category", "tags", "status"];

  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) {
      article[field] = data[field];
    }
  });

  await article.save();

  const updatedArticle = await Article.findById(id)
    .populate("author", "name")
    .lean();

  return formatArticleStats(updatedArticle);
};

export const deleteArticleService = async (id, userId, role) => {
  const article = await Article.findById(id);

  if (!article) {
    return null;
  }

  validateOwnership(article, userId, role);

  return await Article.findByIdAndDelete(id).select("-__v").lean();
};

export const getMyArticlesService = async (userId) => {
  const articles = await Article.find({
    author: userId,
  })
    .select(ARTICLE_SELECT_FIELDS)
    .sort({
      createdAt: -1,
    })
    .lean();

  return articles.map(formatArticleStats);
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
    status: "published",

    createdAt: {
      $gte: date,
    },
  })
    .populate("author", "name")
    .lean();

  const trending = await Promise.all(
    articles.map(async (article) => {
      const likes = article.likes?.length || 0;

      const dislikes = article.dislikes?.length || 0;

      const views = article.views || 0;

      const commentCount = await Comment.countDocuments({
        article: article._id,

        isDeleted: false,
      });

      const hoursOld =
        (Date.now() - new Date(article.createdAt)) / (1000 * 60 * 60);

      const freshness = Math.max(20 - hoursOld * 0.5, 0);

      const trendingScore = Number(
        (
          likes * 4 +
          commentCount * 2 +
          views * 0.3 -
          dislikes * 3 +
          freshness
        ).toFixed(2),
      );

      return {
        _id: article._id,

        title: article.title,

        slug: article.slug,

        excerpt: article.excerpt,

        category: article.category,

        tags: article.tags,

        author: article.author,

        views,

        readingTime: article.readingTime,

        totalLikes: likes,

        totalDislikes: dislikes,

        totalComments: commentCount,

        trendingScore,

        createdAt: article.createdAt,
      };
    }),
  );

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

    status: "published",

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

    .select(RECOMMENDED_ARTICLE_FIELDS)
    .sort({
      views: -1,
    })

    .limit(5)
    .lean();

  return articles;
};

export const changeArticleStatusService = async (id, status, userId) => {
  const article = await Article.findById(id);

  if (!article) {
    return null;
  }

  validateOwnership(article, userId);

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

  validateOwnership(article, userId, role);

  const commentCount = await Comment.countDocuments({
    article: article._id,

    isDeleted: {
      $ne: true,
    },
  });

  const totalLikes = article.likes?.length || 0;

  const totalDislikes = article.dislikes?.length || 0;

  const totalViews = article.views || 0;

  const engagementRate =
    totalViews > 0
      ? `${(((totalLikes + commentCount) / totalViews) * 100).toFixed(2)}%`
      : "N/A";

  return {
    title: article.title,

    slug: article.slug,

    views: totalViews,

    likes: totalLikes,

    dislikes: totalDislikes,

    comments: commentCount,

    engagementRate,
  };
};
