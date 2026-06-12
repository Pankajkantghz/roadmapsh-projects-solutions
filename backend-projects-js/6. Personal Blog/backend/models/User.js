import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,

      trim: true,
    },
    email: {
      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true,
    },
    role: {
      type: String,

      enum: ["user", "admin"],

      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    password: {
      type: String,

      required: true,

      minlength: 6,
    },
    refreshToken: {
      type: String,

      default: null,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Article",
      },
    ],
    resetPasswordOTP: {
      type: String,

      default: null,
    },

    resetPasswordOTPExpires: {
      type: Date,

      default: null,
    },
    loginAttempts: {
      type: Number,

      default: 0,
    },

    lockUntil: {
      type: Date,

      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    mustResetPassword: {
      type: Boolean,
      default: false,
    },

    passwordResetRequestCount: {
      type: Number,
      default: 0,
    },

    passwordResetRequestDate: {
      type: Date,
      default: null,
    },

    passwordResetCooldown: {
      type: Date,
      default: null,
    },
    unlockOTPRequestCount: {
      type: Number,
      default: 0,
    },

    unlockOTPRequestDate: {
      type: Date,
      default: null,
    },

    unlockOTPCooldown: {
      type: Date,
      default: null,
    },
    
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;

        delete ret.refreshToken;

        delete ret.resetPasswordOTP;

        delete ret.resetPasswordOTPExpires;

        delete ret.loginAttempts;

        delete ret.lockUntil;

        delete ret.isVerified;

        delete ret.__v;

        delete ret.mustResetPassword;

        delete ret.passwordResetRequestCount;
        delete ret.passwordResetRequestDate;
        delete ret.passwordResetCooldown;

        delete ret.unlockOTPRequestCount;
        delete ret.unlockOTPRequestDate;
        delete ret.unlockOTPCooldown;

        return ret;
      },
    },
  },
);

userSchema.pre(
  "save",

  async function () {
    if (!this.isModified("password")) {
      return;
    }

    this.password = await bcrypt.hash(
      this.password,

      10,
    );
  },
);

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(
    password,

    this.password,
  );
};

const User = mongoose.model("User", userSchema);

export default User;
