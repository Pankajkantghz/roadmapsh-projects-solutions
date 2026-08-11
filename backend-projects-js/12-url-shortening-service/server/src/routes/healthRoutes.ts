import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "UP" : "DOWN";
  const redisStatus = redisClient?.isOpen ? "UP" : "DOWN";

  const isHealthy = mongoStatus === "UP" && redisStatus === "UP";

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      database: mongoStatus,
      cache: redisStatus,
    },
  });
});

export default router;