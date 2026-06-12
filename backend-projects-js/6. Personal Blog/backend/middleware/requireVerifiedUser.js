import ApiError from "../utils/ApiError.js";

const requireVerifiedUser = (req, res, next) => {
  if (!req.user?.isVerified) {
    throw new ApiError(403, "Please verify your account");
  }

  if (req.user.accountStatus === "suspended") {
    throw new ApiError(403, "Your account is suspended");
  }

  if (req.user.accountStatus === "banned") {
    throw new ApiError(403, "Your account has been banned");
  }

  next();
};

export default requireVerifiedUser;
