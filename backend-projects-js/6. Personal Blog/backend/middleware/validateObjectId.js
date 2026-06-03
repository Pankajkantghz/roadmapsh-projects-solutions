
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const validateObjectId =
  (paramName = "id") =>
  (
    req,
    res,
    next,
  ) => {
    const id =
      req.params[
        paramName
      ];

    if (
      !mongoose.Types.ObjectId.isValid(
        id,
      )
    ) {
      throw new ApiError(
        400,
        "Invalid article ID",
      );
    }

    next();
  };

export default validateObjectId;

