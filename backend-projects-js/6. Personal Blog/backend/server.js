import "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import errorHandler from "./middleware/errorHandler.js";
import { authLimiter, globalLimiter } from "./middleware/rateLimiter.js";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger.js";
connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan("dev"));

const PORT = process.env.PORT || 5000;

// Body Parser

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

// Cookie Parser

app.use(cookieParser());

app.use(globalLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Blog API Running",
  });
});
const API_VERSION = "/api/v1";

app.use(`${API_VERSION}/auth`, authRoutes);

app.use(`${API_VERSION}`, articleRoutes);

app.use(`${API_VERSION}/admin`, adminRoutes);

app.use(`${API_VERSION}/upload`, uploadRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
