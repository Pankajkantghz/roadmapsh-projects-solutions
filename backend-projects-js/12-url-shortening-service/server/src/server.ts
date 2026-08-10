import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";

import { rateLimit } from "express-rate-limit";
import session from "express-session"; // 🆕 Added session import for X (Twitter) OAuth 2.0 State
import passport from "passport";
import { configurePassport } from "./config/passport.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import { redirectShortUrl } from "./controllers/urlController.js";

const app = express();

// =========================================================================
// SECURITY & BASIC MIDDLEWARE
// =========================================================================
app.use(helmet());
app.use(express.json({ limit: "10kb" }));


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
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// =========================================================================
// SESSION & PASSPORT INITIALIZATION (Crucial for X / Twitter PKCE)
// =========================================================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "darth_secret_session_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production if running behind an HTTPS proxy
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session()); // This handles the state preservation Google expects

configurePassport();
// =========================================================================
// RATE LIMITERS
// =========================================================================
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


// =========================================================================
// APPLICATION ROUTES
// =========================================================================
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
    security:
      "Helmet + NoSQL Mutation Bypass + Rate-Limiting + Sessions Active",
  });
});

app.get("/:shortCode", redirectShortUrl);

// =========================================================================
// ERROR HANDLING & LIFECYCLE
// =========================================================================
app.use(errorHandler);

const startServers = async () => {
  await connectDB();
  await connectRedis();
};

startServers().catch((err) => {
  console.error(`Infrastructure cluster connection error: ${err}`);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Secure SnapRoute Engine active at http://localhost:${PORT}`);
});
