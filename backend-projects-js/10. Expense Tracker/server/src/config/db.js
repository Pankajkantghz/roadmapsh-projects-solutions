import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log(
      "✅ Securely connected to PostgreSQL container at:",
      res.rows[0].now,
    );
  }
});

export const query = (text, params) => pool.query(text, params);
