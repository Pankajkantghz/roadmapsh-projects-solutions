import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
dotenv.config();

const app: Application = express();
const PORT = 3000;
app.use(express.json());

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