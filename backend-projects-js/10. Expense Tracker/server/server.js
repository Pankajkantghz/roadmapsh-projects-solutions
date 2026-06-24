import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js"
import { errorHandler } from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expenses", expenseRoutes);


//global error handler

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server booting cleanly on http://localhost:${PORT}`);
});
