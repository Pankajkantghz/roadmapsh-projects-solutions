import { model, Schema } from "mongoose";
import { ITodo } from "../types/index.js";

const todoSchema = new Schema<ITodo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Todo must belong to a user"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
export const Todo = model<ITodo>("Todo", todoSchema);
