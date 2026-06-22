import { query } from "../config/db.js";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email) => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const createUser = async (name, email, password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const result = await query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
    [name, email, hashedPassword],
  );

  return result.rows[0];
};

export const verifyUserCredentials = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const storeRefreshToken = async (userId, token) => {
  await query("INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)", [
    userId,
    token,
  ]);
};

export const verifyWhitelistedToken = async (token) => {
  const result = await query("SELECT * FROM refresh_tokens WHERE token = $1", [
    token,
  ]);

  return result.rows[0];
};

export const revokeRefreshToken = async (token) => {
  await query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
};
