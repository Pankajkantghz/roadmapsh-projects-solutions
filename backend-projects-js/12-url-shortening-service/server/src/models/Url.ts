import { model, Schema } from "mongoose";
import { IUrl } from "../types/url.js";

const UrlSchema = new Schema<IUrl>(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
      index: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      default: null, 
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

UrlSchema.index({ shortCode: "text", originalUrl: "text" });

export const Url = model<IUrl>("Url", UrlSchema);