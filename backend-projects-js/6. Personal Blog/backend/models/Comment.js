import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Article",

      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    content: {
      type: String,

      required: true,

      minlength: 2,

      maxlength: 500,
    },
    isDeleted: {
      type: Boolean,

      default: false,
    },

    deletedAt: {
      type: Date,

      default: null,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },

  {
    timestamps: true,

    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;

        return ret;
      },
    },
  },
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
