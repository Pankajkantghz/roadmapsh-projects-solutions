import { Router } from "express";
import { loginSchema, RegisterSchema } from "../validators/auth.validators.js";
import {
  login,
  logoutSession,
  refreshSession,
  register,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshSession);
router.post("/logout", logoutSession);

export default router;
