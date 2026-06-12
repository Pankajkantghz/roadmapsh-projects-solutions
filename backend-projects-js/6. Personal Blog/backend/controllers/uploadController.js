import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/ApiError.js";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Image is required");
  }

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "personal-blog",
      },

      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        imageUrl: result.secure_url,
      },
      "Image uploaded successfully",
    ),
  );
});
