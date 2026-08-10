import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (payload: TokenPayload): string =>
  jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || "fallback_access_secret_darth_key",
    {
      expiresIn: (process.env.JWT_ACCESS_EXPIRY || "15m") as any,
    },
  );

export const generateRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_darth_key",
    {
      expiresIn: (process.env.JWT_REFRESH_EXPIRY || "7d") as any,
    },
  );
