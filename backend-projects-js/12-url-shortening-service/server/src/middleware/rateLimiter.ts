import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis.js";
import { AppError } from "../utils/AppError.js";

interface RateLimitOptions {
  windowSizeInSeconds: number;
  maxRequests: number;
  endpointName: string;
}


export function rateLimiter(options: RateLimitOptions) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // 1. Identify the client by their IP address (falling back to generic if local)
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const cacheKey = `ratelimit:${options.endpointName}:${clientIp}`;

    try {
      // 2. Multi/Exec atomic transaction pipeline
      const [currentRequests] = (await redisClient
        .multi()
        .incr(cacheKey)
        .expire(cacheKey, options.windowSizeInSeconds, "NX") // Only set expiration on the first hit
        .exec()) as [number, unknown];

      // 3. Inspect threshold boundaries
      if (currentRequests > options.maxRequests) {
        const ttl = await redisClient.ttl(cacheKey);
        res.setHeader("Retry-After", ttl);

        throw new AppError(
          `Too many requests to the ${options.endpointName} endpoint. Please slow down. Try again in ${ttl} seconds.`,
          429,
        );
      }

      // 4. Expose tracking headers to the client
      res.setHeader("X-RateLimit-Limit", options.maxRequests);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, options.maxRequests - currentRequests),
      );

      next();
    } catch (error) {
      next(error);
    }
  };
}
