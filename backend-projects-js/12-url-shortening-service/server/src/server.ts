import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";

import { redirectShortUrl } from "./controllers/urlController.js";

const app = express();

app.use((req, _res, next) => {
  if (req.query) {
    Object.defineProperty(req, "query", {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }
  next();
});

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "fail",
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use("/api", globalLimiter);

const creationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Link creation limit exceeded. Slow down.",
  },
});

const startServers = async () => {
  await connectDB();
  await connectRedis();
};

startServers().catch((err) => {
  console.error(`Infrastructure cluster connection error: ${err}`);
  process.exit(1);
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", creationLimiter, urlRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    brand: "SnapRoute Core",
    tagline: "High-speed, collision-free URL automation layers.",
    version: "1.0.0",
    author: "darth",
    runtime: "Node.js (TypeScript)",
    security: "Helmet + NoSQL Mutation Bypass + Rate-Limiting Active",
  });
});

app.get("/:shortCode", redirectShortUrl);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Secure SnapRoute Engine active at http://localhost:${PORT}`);
});
