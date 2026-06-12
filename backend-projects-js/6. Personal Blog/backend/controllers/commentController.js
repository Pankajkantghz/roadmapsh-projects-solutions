import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/ApiError.js";

import {
  createCommentService,
  getCommentsService,
  updateCommentService,
  deleteCommentService,
  replyToCommentService,
} from "../services/commentService.js";

export const createComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await createCommentService(id, req.user._id, content);

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

export const getComments = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comments = await getCommentsService(id);

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await updateCommentService(id, req.user._id, content);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await deleteCommentService(id, req.user._id, req.user.role);

  if (!deleted) {
    throw new ApiError(404, "Comment not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export const replyToComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const reply = await replyToCommentService(id, req.user._id, content);

  res.status(201).json(new ApiResponse(201, reply, "Reply added successfully"));
});
