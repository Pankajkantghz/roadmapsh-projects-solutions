import Article from "../models/Article.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const toggleBookmarkService = async (articleId, userId) => {
  const article = await Article.findById(articleId);

  if (!article || article.status !== "published") {
    throw new ApiError(404, "Article not found");
  }

  const user = await User.findById(userId);

  const alreadyBookmarked = user.bookmarks.some(
    (id) => id.toString() === articleId,
  );

  if (alreadyBookmarked) {
    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== articleId);
  } else {
    user.bookmarks.push(articleId);
  }

  await user.save();

  return {
    isBookmarked: !alreadyBookmarked,

    totalBookmarks: user.bookmarks.length,

    message: alreadyBookmarked
      ? "Bookmark removed successfully"
      : "Article bookmarked successfully",
  };
};

export const getBookmarksService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "bookmarks",
    match: {
      status: "published",
    },

    select: `
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
`,
  });

  return user.bookmarks.map((article) => {
    const { likes, dislikes, ...safeArticle } = article.toObject();

    return {
      ...safeArticle,

      totalLikes: likes?.length || 0,

      totalDislikes: dislikes?.length || 0,
    };
  });
};
