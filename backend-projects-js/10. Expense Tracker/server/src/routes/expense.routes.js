import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createExpense,
  getExpenses,
} from "../controllers/expense.controller.js";

const router = express.Router();


router.post("/", isAuth, createExpense);
router.get("/", isAuth, getExpenses);

export default router;
