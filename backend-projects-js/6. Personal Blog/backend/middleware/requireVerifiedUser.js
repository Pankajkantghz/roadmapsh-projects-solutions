import ApiError from "../utils/ApiError.js";

const requireVerifiedUser = (req, res, next) => {
  if (!req.user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  next();
};

export default requireVerifiedUser;
