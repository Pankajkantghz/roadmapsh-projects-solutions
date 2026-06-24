import * as expenseService from "../services/expense.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const addExpense = catchAsync(async (req, res, next) => {
  const { title, amount, category } = req.body;
  if (!title || !amount || !category) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Validation failed: title, amount, and category are required.",
      });
  }

  const expense = await expenseService.createExpense(req.user.id, req.body);
  return res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

export const getExpensesList = catchAsync(async (req, res, next) => {
  const result = await expenseService.getFilteredExpenses(
    req.user.id,
    req.query,
  );
  return res.status(200).json({
    success: true,
    message: "Expenses fetched successfully",
    data: result,
  });
});

export const getSingleExpense = catchAsync(async (req, res, next) => {
  const expense = await expenseService.getExpenseById(
    req.params.id,
    req.user.id,
  );
  if (!expense) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found", data: null });
  }
  return res.status(200).json({
    success: true,
    message: "Expense fetched successfully",
    data: expense,
  });
});

export const editExpense = catchAsync(async (req, res, next) => {
  const updatedExpense = await expenseService.updateExpense(
    req.params.id,
    req.user.id,
    req.body,
  );
  if (!updatedExpense) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found", data: null });
  }
  return res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: updatedExpense,
  });
});

export const removeExpense = catchAsync(async (req, res, next) => {
  const deleted = await expenseService.deleteExpense(
    req.params.id,
    req.user.id,
  );
  if (!deleted) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found", data: null });
  }
  return res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
    data: null,
  });
});
