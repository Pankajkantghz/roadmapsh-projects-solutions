import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
dotenv.config();

const app: Application = express();
const PORT = 3000;
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "healthy", message: "Server is running smoothly" });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running in development mode on port ${PORT}`);
  });
};

startServer();
