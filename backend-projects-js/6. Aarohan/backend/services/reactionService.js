import Article from "../models/Article.js";
import ApiError from "../utils/ApiError.js";

export const toggleReaction = async (articleId, userId, action) => {
  const allowedActions = ["like", "dislike"];

  if (!allowedActions.includes(action)) {
    throw new ApiError(400, "Invalid reaction type");
  }

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
      article.likes.push(userId);

      article.dislikes = dislikes.filter((id) => id.toString() !== userIdStr);
    }
  }

  if (action === "dislike") {
    if (alreadyDisliked) {
      article.dislikes = dislikes.filter((id) => id.toString() !== userIdStr);
    } else {
      article.dislikes.push(userId);

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
