import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import converterRoutes from "./routes/converterRoutes.js";

const app = express();
const PORT = 5000;

/* Security headers */
app.use(helmet());

/* Allow frontend requests */
app.use(
  cors({
    origin:
      "https://unit-converter-rose-two.vercel.app"
  })
);

/* Parse JSON body + limit payload size */
app.use(
  express.json({
    limit: "10kb",
  })
);

/* API request logging */
app.use(
  morgan("dev")
);

/* Prevent spam / bot attacks */
const limiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,
    max: 100,
    message:
      "Too many requests",
  });

app.use(limiter);

/* Health check route */
app.get("/", (
  req,
  res
) => {
  res.send(
    "Server is running"
  );
});

/* API routes */
app.use(
  "/api",
  converterRoutes
);

/* Start server */
app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );
  }
);