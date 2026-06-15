import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import { rateLimit } from 'express-rate-limit'
import { createClient } from "redis";

dotenv.config();

const app = express();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)
const port = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis local client Error", err));

await redisClient.connect();

console.log("Sucessfully connected to local server");

console.log();

app.get("/weather/:city", async (req, res) => {
  const { city } = req.params;

  const cacheKey = `weather:${city.toLowerCase().trim()}`;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}`;
  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`Local cache hit pulling ${city} data from your ram.`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(
      `local cache miss: fecting fresh data for [$city] from weather api`,
    );
    const response = await axios(url);

    await redisClient.set(cacheKey, JSON.stringify(response.data), {
      EX: 43200,
    });

    return res.json(response.data);
  } catch (error: any) {
    console.error("Application Error:", error.message);
    return res.status(500).json({
      error:
        "Failed to handle weather request. Verify your API key or city spelling.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
