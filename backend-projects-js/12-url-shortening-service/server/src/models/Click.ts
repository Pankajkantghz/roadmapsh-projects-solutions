import { Schema, model, Document, Types } from "mongoose";

export interface IClick extends Document {
  urlId: Types.ObjectId;
  shortCode: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  timestamp: Date;
}

const clickSchema = new Schema<IClick>(
  {
    urlId: {
      type: Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true, 
    },
    shortCode: {
      type: String,
      required: true,
      index: true,
    },
    browser: { type: String, default: "Unknown" },
    os: { type: String, default: "Unknown" },
    device: { type: String, default: "Desktop" },
    referrer: { type: String, default: "Direct" },
  },
  { timestamps: { createdAt: "timestamp", updatedAt: false } },
);

export const Click = model<IClick>("Click", clickSchema);
