import { Router } from "express";

import rateLimit from "express-rate-limit";
import {
  signup,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
