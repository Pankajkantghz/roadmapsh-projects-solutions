import Comment from "../models/Comment.js";
import Article from "../models/Article.js";
import ApiError from "../utils/ApiError.js";

const COMMENT_POPULATE_FIELDS = "name";

const validateOwnership = (comment, userId, role = null) => {
  const isOwner = comment.user.toString() === userId.toString();

  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized");
  }
};

export const createCommentService = async (
  articleId,
  userId,
  content,
  parentComment = null,
) => {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const comment = await Comment.create({
    article: articleId,
    user: userId,
    content,
    parentComment,
  });

  return await comment.populate("user", COMMENT_POPULATE_FIELDS);
};

export const getCommentsService = async (articleId) => {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  const comments = await Comment.find({
    article: articleId,
    parentComment: null,
    isDeleted: false,
  })
    .select("-__v")
    .populate("user", COMMENT_POPULATE_FIELDS)
    .sort({
      createdAt: -1,
    })
    .lean();

  const commentIds = comments.map((comment) => comment._id);

  const replies = await Comment.find({
    parentComment: {
      $in: commentIds,
    },
    isDeleted: false,
  })
    .select("-__v")
    .populate("user", COMMENT_POPULATE_FIELDS)
    .sort({
      createdAt: 1,
    })
    .lean();

  const repliesMap = {};

  replies.forEach((reply) => {
    const parentId = reply.parentComment.toString();

    if (!repliesMap[parentId]) {
      repliesMap[parentId] = [];
    }

    repliesMap[parentId].push(reply);
  });

  comments.forEach((comment) => {
    comment.replies = repliesMap[comment._id.toString()] || [];
  });

  return comments;
};

export const updateCommentService = async (id, userId, content) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    return null;
  }

  validateOwnership(comment, userId);

  comment.content = content;

  await comment.save();

  return comment;
};

export const deleteCommentService = async (id, userId, role) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    return null;
  }

  validateOwnership(comment, userId, role);

  comment.isDeleted = true;

  comment.deletedAt = new Date();

  await comment.save();

  return comment;
};

export const replyToCommentService = async (
  parentCommentId,
  userId,
  content,
) => {
  const parentComment = await Comment.findById(parentCommentId);

  if (!parentComment) {
    throw new ApiError(404, "Comment not found");
  }

  return await createCommentService(
    parentComment.article,
    userId,
    content,
    parentCommentId,
  );
};
