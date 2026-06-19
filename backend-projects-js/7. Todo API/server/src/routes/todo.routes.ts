import { Router } from "express";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";
import { createTodoSchema, updateTodoSchema } from "../validators/todo.validator.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);

router.post("/", validate(createTodoSchema), createTodo);
router.get("/", getTodos);
router.put("/:id", validate(updateTodoSchema), updateTodo);
router.delete("/:id", deleteTodo);

export default router;
