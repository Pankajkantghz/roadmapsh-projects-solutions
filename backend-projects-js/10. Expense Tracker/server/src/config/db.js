import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log(
    `✅ Securely connected to PostgreSQL container at: ${new Date().toISOString()}`,
  );
});


export const query = (text, params) => pool.query(text, params);
