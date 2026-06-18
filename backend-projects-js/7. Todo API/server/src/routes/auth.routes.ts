import { Router } from "express";
import { loginSchema, RegisterSchema } from "../validators/auth.validators.js";
import { login, register } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
