import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import { timeStamp } from "node:console";
import { authLimiter, globalLimiter } from "./middleware/rateLimit.middleware.js";

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Global Rate limiter
app.get("api/", globalLimiter);

// Auth rateLimiter
app.use("/api/auth", authLimiter);

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Health Check

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    message: "Server is running smoothly",
    timeStamp: new Date(),
  });
});

// Global Error Handling Middleware

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Exception Caught:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connection verified successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error("Fatal error during application startup:", error);
    process.exit(1); // Force terminate execution if system can't boot
  }
};

startServer();

export default app;
