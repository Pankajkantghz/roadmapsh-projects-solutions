import express from "express";
import { env } from "./config/env.config.js";
import { pool } from "./config/db.js";
import { postRoutes } from "./routes/post.routes.js"; // 💡 1. Ensure this import is exactly right
const app = express();
const PORT = env.PORT || 8000;

// Standard middleware to parse incoming JSON request bodies
app.use(express.json());

// 💡 2. Use 'postRoutes' here instead of 'post'!
app.use("/posts", postRoutes);

// Optional base safety check endpoint
app.get("/", (req, res) => {
  res.send("Blogging Platform API is fully online!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running dynamically on http://localhost:${PORT}`);
});
