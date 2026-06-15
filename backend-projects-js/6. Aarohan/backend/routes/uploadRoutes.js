import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";
import upload from "../middleware/upload.js";

import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload image
 *     description: |
 *       Upload an image file.
 *
 *       Features:
 *       - Upload image using multipart/form-data
 *       - JWT authentication required
 *       - Returns uploaded image URL
 *       - Used for article content/images
 *
 *       Requirements:
 *       - Authorization required
 *       - Image file required
 *
 *     tags:
 *       - Upload
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *
 *     responses:
 *
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusCode: 200
 *               message: Image uploaded successfully
 *               data:
 *                 imageUrl: https://res.cloudinary.com/demo/image/upload/sample.jpg
 *
 *       400:
 *         description: No image uploaded
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: No image uploaded
 *
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             examples:
 *
 *               MissingToken:
 *                 summary: No token provided
 *                 value:
 *                   success: false
 *                   message: Unauthorized access
 *
 *               InvalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *
 *       500:
 *         description: Internal server error
 */

router.post("/image", verifyJWT, upload.single("image"), uploadImage);

export default router;
