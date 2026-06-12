import "./config/env.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import swaggerUi from "swagger-ui-express";

import connectDB from "./config/db.js";
import swaggerSpec from "./config/swagger.js";
import errorHandler from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

// Route Imports
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = "/api/v1";

// 1. Security & Optimization Settings
app.set("trust proxy", 1); // Crucial for hosting behind reverse proxies (Render, AWS, DigitalOcean)
app.use(helmet());
app.use(compression());

// 2. CORS 
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Request Parsing & Logging
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 4. Global Rate Limiting
app.use(globalLimiter);

// 5. Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Base Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog API Running",
  });
});

// 7. API Routes Mapping
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/articles`, articleRoutes); 
app.use(`${API_VERSION}/comments`, commentRoutes); 
app.use(`${API_VERSION}/admin`, adminRoutes);
app.use(`${API_VERSION}/upload`, uploadRoutes);

// 8. 404 Route Fallback
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// 9. Centralized Error Handling (URI Error handling should be moved inside this file)
app.use(errorHandler);

// 10. Robust Server Bootstrapping
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();