import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  addExpense,
  getExpensesList,
  getSingleExpense,
  editExpense,
  removeExpense,
} from "../controllers/expense.controller.js";

const router = express.Router();

router.use(isAuth); // Secures all routes

router.post("/", addExpense);
router.get("/", getExpensesList);
router.get("/:id", getSingleExpense);
router.put("/:id", editExpense);
router.delete("/:id", removeExpense);

export default router;
