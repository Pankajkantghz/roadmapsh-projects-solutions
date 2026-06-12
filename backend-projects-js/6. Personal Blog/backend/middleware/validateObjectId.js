import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const validateObjectId =
  (resource = "resource", paramName = "id") =>
  (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      throw new ApiError(400, `${resource} ID is required`);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, `Invalid ${resource} ID`);
    }

    next();
  };

export default validateObjectId;
