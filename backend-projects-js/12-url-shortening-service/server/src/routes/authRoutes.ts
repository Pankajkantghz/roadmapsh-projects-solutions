import { Router } from "express";
import { validate } from "../validators";
import { loginSchema, registerSchema } from "../validators/authValidator";
import { loginHandler, registerHandler } from "../controllers/authController";

const router = Router();

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

export default router;
