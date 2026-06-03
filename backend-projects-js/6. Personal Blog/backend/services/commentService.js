import Comment from "../models/Comment.js";
import ApiError from "../utils/ApiError.js";

export const createCommentService = async (
  articleId,
  userId,
  content,
  parentComment = null,
) => {
  return await Comment.create({
    article: articleId,

    user: userId,

    content,

    parentComment,
  });
};
export const getCommentsService = async (articleId) => {
  const comments = await Comment.find({
    article: articleId,

    parentComment: null,

    isDeleted: false,
  })
    .select("-__v")

    .populate("user", "name")

    .sort({
      createdAt: -1,
    })

    .lean();

  for (const comment of comments) {
    const replies = await Comment.find({
      parentComment: comment._id,

      isDeleted: false,
    })
      .select("-__v")

      .populate("user", "name")

      .sort({
        createdAt: 1,
      })

      .lean();

    comment.replies = replies;
  }

  return comments;
};

export const updateCommentService = async (id, userId, content) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    return null;
  }
  if (comment.user.toString() !== userId.toString()) {
    throw new ApiError(
      403,

      "You are not authorized",
    );
  }

  comment.content = content;

  await comment.save();
  return comment;
};

export const deleteCommentService = async (id, userId, role) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    return null;
  }

  const isOwner = comment.user.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      403,

      "You are not authorized",
    );
  }
  comment.isDeleted = true;
  comment.deletedAt = new Date();

  await comment.save();

  return true;
};
