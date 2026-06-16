import { Router } from "express";
import { PostController } from "../controllers/post.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPostValidator } from "../validators/post.validator.js";

const router = Router();
const postController = new PostController();

router.post("/", validate(createPostValidator), postController.create);

router.get("/", postController.getAll);

router.get("/:id", postController.getById);

router.put("/:id", validate(createPostValidator), postController.update);

router.delete("/:id", postController.delete);

export { router as postRoutes };
