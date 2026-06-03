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
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post("/image", verifyJWT, upload.single("image"), uploadImage);

router.post("/image", verifyJWT, upload.single("image"), uploadImage);

export default router;
