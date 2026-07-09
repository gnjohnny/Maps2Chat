import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import path from "path";
import axios from "axios";
import { leadRouter } from "./routes/leadRoutes";
import { authRouter } from "./routes/authRoutes";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { startIngestionScheduler, runIngestionDaemon } from "./daemon/scraper";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL!, "http://localhost:4173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(passport.initialize());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);

// Manual scraper trigger route (called by ScraperTrigger in dashboard)
app.post("/api/scraper/trigger", requireAuth, async (req, res, next) => {
  try {
    const { query } = req.body;
    const result = await runIngestionDaemon(query || "shops in Nairobi");
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", timestamp: new Date() });
});

// Serve React client static assets in production
const clientBuildPath = path.join(__dirname, "../../client/dist");
app.use(express.static(clientBuildPath));

// Catch-all route to serve index.html for React Router
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start node-cron scheduling
startIngestionScheduler();

// Self-ping to prevent Render sleeping on Free tier (every 14 minutes)
function startSelfPing() {
  const externalUrl = process.env.RENDER_EXTERNAL_URL;
  if (!externalUrl) {
    console.log("[Ping] RENDER_EXTERNAL_URL is not set. Self-ping skipped (local dev mode).");
    return;
  }

  console.log(`[Ping] Registering self-ping loop for URL: ${externalUrl}`);
  setInterval(async () => {
    try {
      const healthUrl = `${externalUrl.replace(/\/$/, "")}/api/health`;
      console.log(`[Ping] Sending self-ping to: ${healthUrl}`);
      const response = await axios.get(healthUrl);
      console.log(`[Ping] Self-ping successful:`, response.data);
    } catch (error: any) {
      console.error(`[Ping] Self-ping failed:`, error.message);
    }
  }, 14 * 60 * 1000);
}

app.listen(PORT, () => {
  console.log(
    `[Server] Maps2Chat API server running on http://localhost:${PORT}`,
  );
  startSelfPing();
});

