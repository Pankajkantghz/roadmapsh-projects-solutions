import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/reddit/:subreddit", async (req, res) => {
  const { subreddit } = req.params;

  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`, {
      headers: {
        "User-Agent": "subreddit-client/5.0",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Subreddit is not found",
      });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log("Fetch error", err);
    return res.status(500).json({
      error: "Unable to fetch the subreddit",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
