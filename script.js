
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/check", (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({
      message: "Please paste a video URL."
    });
  }

  try {
    const parsed = new URL(videoUrl);

    const allowedHosts = [
      "youtube.com",
      "www.youtube.com",
      "youtu.be",
      "instagram.com",
      "www.instagram.com"
    ];

    if (
      !["https:", "http:"].includes(parsed.protocol) ||
      !allowedHosts.includes(parsed.hostname)
    ) {
      return res.status(400).json({
        message: "Enter a supported Instagram or YouTube URL."
      });
    }

    res.json({
      message: "Link format accepted. Download availability must be verified."
    });
  } catch {
    res.status(400).json({
      message: "That URL is not valid."
    });
  }
});

app.listen(PORT, () => {
  console.log(`ReelVault running on port ${PORT}`);
});
