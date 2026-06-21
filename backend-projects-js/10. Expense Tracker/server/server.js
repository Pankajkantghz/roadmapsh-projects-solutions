import express from "express";
import dotenv from "dotenv";
import "./src/config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is online and healthy" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server booting cleanly on http://localhost:${PORT}`);
});
