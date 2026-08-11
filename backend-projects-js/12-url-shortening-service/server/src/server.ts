import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import path from "path";

import { rateLimit } from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { configurePassport } from "./config/passport.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import healthRouter from "./routes/healthRoutes.js";
import { redirectShortUrl } from "./controllers/urlController.js";
import { startExpiredLinksCron } from "./jobs/expiredLinksCron.js";

const app = express();

// Security and basic middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

// Prevent prototype pollution / query object manipulation
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

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Session and Passport initialization for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "darth_secret_session_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Swagger OpenAPI documentation
const openapiPath = path.join(process.cwd(), "docs", "openapi.yaml");
const swaggerDocument = YAML.load(openapiPath);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "SnapRoute Core | API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

app.get("/api-docs/openapi.yaml", (_req, res) => {
  res.sendFile(openapiPath);
});

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use("/api", globalLimiter);

// Application routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", urlRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "active",
    brand: "SnapRoute Core",
    tagline: "High-speed, collision-free URL automation layers.",
    version: "1.0.0",
    author: "darth",
    docs: "http://localhost:5000/api-docs",
    runtime: "Node.js (TypeScript)",
    security: "Helmet + NoSQL Mutation Bypass + Rate-Limiting + Sessions Active",
  });
});

// Short URL redirection
app.get("/:shortCode", redirectShortUrl);

// Global Error Handler (MUST BE LAST ROUTE MIDDLEWARE)
app.use(errorHandler);

// Process Level Safety Net
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...", err);
  process.exit(1);
});

const startServers = async () => {
  await connectDB();
  await connectRedis();
  startExpiredLinksCron();

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Secure SnapRoute Engine active at http://localhost:${PORT}`);
    console.log(
      `Swagger documentation available at http://localhost:${PORT}/api-docs`,
    );
  });

  process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! Shutting down gracefully...", err);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServers().catch((err) => {
  console.error(`Infrastructure cluster connection error: ${err}`);
  process.exit(1);
});