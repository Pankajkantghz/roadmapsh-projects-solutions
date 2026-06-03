import Article from "../models/Article.js";

import {
  changeArticleStatusService,
  createArticleService,
  deleteArticleService,
  getAllArticlesService,
  getArticleAnalyticsService,
  getMyArticlesService,
  getRecommendedArticlesService,
  getSingleArticleService,
  getTrendingArticlesService,
  updateArticleService,
} from "../services/articleService.js";
import asyncHandler from "../utils/asyncHandler.js";



const toggleReaction = async (articleId, userId, action) => {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const userIdStr = userId.toString();

  const likes = article.likes || [];

  const dislikes = article.dislikes || [];

  const alreadyLiked = likes.some((id) => id.toString() === userIdStr);

  const alreadyDisliked = dislikes.some((id) => id.toString() === userIdStr);

  if (action === "like") {
    if (alreadyLiked) {
      article.likes = likes.filter((id) => id.toString() !== userIdStr);
    } else {
      article.likes.push(userIdStr);

      article.dislikes = dislikes.filter((id) => id.toString() !== userIdStr);
    }
  }

  if (action === "dislike") {
    if (alreadyDisliked) {
      article.dislikes = dislikes.filter((id) => id.toString() !== userIdStr);
    } else {
      article.dislikes.push(userIdStr);

      article.likes = likes.filter((id) => id.toString() !== userIdStr);
    }
  }

  await article.save();

  return {
    likes: article.likes.length,

    dislikes: article.dislikes.length,

    isLiked: article.likes.some((id) => id.toString() === userIdStr),

    isDisliked: article.dislikes.some((id) => id.toString() === userIdStr),
  };
};

export const createArticle = asyncHandler(async (req, res) => {
  const article = await createArticleService({
    ...req.body,

    author: req.user._id,
  });

  res
    .status(201)

    .json(
      new ApiResponse(
        201,

        article,

        "Article created successfully",
      ),
    );
});

export const getAllArticles = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Math.min(Number(req.query.limit) || 5, 50);

  const {
    category,

    sort,

    tag,

    q,
  } = req.query;

  const results = await getAllArticlesService(
    page,
    limit,
    category,
    sort,
    tag,
    q,
  );

  res
    .status(200)

    .json(
      new ApiResponse(
        200,

        results,

        "Articles fetched successfully",
      ),
    );
});

export const getSingleArticle = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const article = await getSingleArticleService(slug);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, article, "Article fetched successfully"));
});

export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await updateArticleService(id, req.body, req.user._id);

  if (!article) {
    throw new ApiError(
      404,

      "Article not found",
    );
  }
  res
    .status(200)

    .json(
      new ApiResponse(
        200,

        article,

        "Article updated successfully",
      ),
    );
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const article = await deleteArticleService(id, req.user._id, req.user.role);

  if (!article) {
    throw new ApiError(
      404,

      "Article not found",
    );
  }
  res
    .status(200)

    .json(
      new ApiResponse(
        200,

        null,

        "Article deleted successfully",
      ),
    );
});

export const getMyArticles = asyncHandler(
  async (
    req,

    res,
  ) => {
    const articles = await getMyArticlesService(req.user._id);

    res
      .status(200)

      .json(
        new ApiResponse(
          200,

          articles,

          "My articles fetched successfully",
        ),
      );
  },
);

export const likeArticle = asyncHandler(async (req, res) => {
  const result = await toggleReaction(req.params.id, req.user._id, "like");

  res
    .status(200)
    .json(new ApiResponse(200, result, "Article liked successfully"));
});

export const dislikeArticle = asyncHandler(async (req, res) => {
  const result = await toggleReaction(req.params.id, req.user._id, "dislike");

  res
    .status(200)
    .json(new ApiResponse(200, result, "Article disliked successfully"));
});

export const getTrendingArticles = asyncHandler(async (req, res) => {
  const { period } = req.query;

  const articles = await getTrendingArticlesService(period);

  res.status(200).json(
    new ApiResponse(
      200,

      articles,

      "Trending articles fetched successfully",
    ),
  );
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    throw new ApiError(
      404,

      "Article not found",
    );
  }

  const user = await User.findById(req.user._id);

  const alreadyBookmarked = user.bookmarks.some(
    (id) => id.toString() === req.params.id,
  );

  if (alreadyBookmarked) {
    user.bookmarks = user.bookmarks.filter(
      (id) => id.toString() !== req.params.id,
    );
  } else {
    user.bookmarks.push(req.params.id);
  }

  await user.save();

  res
    .status(200)

    .json(
      new ApiResponse(
        200,

        {
          isBookmarked: !alreadyBookmarked,

          totalBookmarks: user.bookmarks.length,
        },

        alreadyBookmarked ? "Bookmark removed" : "Article bookmarked",
      ),
    );
});

export const getBookmarks = asyncHandler(
  async (
    req,

    res,
  ) => {
    const user = await User.findById(req.user._id)

      .populate({
        path: "bookmarks",

        select: "-__v",
      });

    res
      .status(200)

      .json(
        new ApiResponse(
          200,

          user.bookmarks,

          "Bookmarks fetched successfully",
        ),
      );
  },
);

export const getRecommendedArticles = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const articles = await getRecommendedArticlesService(id);

  res
    .status(200)

    .json(
      new ApiResponse(
        200,

        articles,

        "Recommended articles fetched successfully",
      ),
    );
});

export const changeArticleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { status } = req.body;

  const article = await changeArticleStatusService(
    id,

    status,

    req.user._id,
  );

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  res
    .status(200)

    .json(
      new ApiResponse(
        200,

        article,

        "Article status updated successfully",
      ),
    );
});

export const getArticleAnalytics = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const analytics = await getArticleAnalyticsService(
    slug,
    req.user._id,
    req.user.role,
  );

  if (!analytics) {
    throw new ApiError(404, "Article not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, analytics, "Analytics fetched successfully"));
});
