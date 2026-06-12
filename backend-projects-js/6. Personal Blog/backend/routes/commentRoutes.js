import express from "express";

import {
  createComment,
  deleteComment,
  getComments,
  replyToComment,
  updateComment,
} from "../controllers/commentController.js";

import verifyJWT from "../middleware/verifyJWT.js";
import requireVerifiedUser from "../middleware/requireVerifiedUser.js";
import validateObjectId from "../middleware/validateObjectId.js";
import { validate } from "../middleware/validate.js";

import { commentSchema } from "../validators/commentValidator.js";

const router = express.Router();

router.post(
  "/articles/:id/comments",
  verifyJWT,
  requireVerifiedUser,
 validateObjectId("commentId"),
  validate(commentSchema),
  createComment,
);

router.get("/articles/:id/comments", validateObjectId(), getComments);

router.post(
  "/comments/:id/reply",
  verifyJWT,
  requireVerifiedUser,
 validateObjectId("commentId"),
  validate(commentSchema),
  replyToComment,
);

router.patch(
  "/comments/:id",
  verifyJWT,
  requireVerifiedUser,
 validateObjectId("commentId"),
  validate(commentSchema),
  updateComment,
);

router.delete(
  "/comments/:id",
  verifyJWT,
  requireVerifiedUser,
 validateObjectId("commentId"),
  deleteComment,
);

export default router;
