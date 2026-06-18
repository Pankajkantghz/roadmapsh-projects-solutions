import { model, Schema } from "mongoose";
import { IUser } from "../types/index.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, //no two users can sign up with the same email
      lowercase: true,
      trim: true,
      index: true, // fast lookup for the login
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);
