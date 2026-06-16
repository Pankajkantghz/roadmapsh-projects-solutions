import mysql from "mysql2/promise";
import { env } from "./env.config.js";

export const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  await pool.query("SELECT 1");
  console.log("📡 Connected to Docker MySQL database successfully!");
} catch (error) {
  console.error("❌ Database connection failed:", error);
  process.exit(1);
}
