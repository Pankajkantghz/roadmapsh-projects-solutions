import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";

export const isAuth = catchAsync(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please provide an access token.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message:
          "Access token is invalid or expired. Please refresh your session.",
      });
    }

    req.user = { id: decoded.userId };

    next();
  });
});
