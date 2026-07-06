import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
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

// Global Error Handler Middleware
app.use(errorHandler);

// Start node-cron scheduling
startIngestionScheduler();

app.listen(PORT, () => {
  console.log(
    `[Server] Maps2Chat API server running on http://localhost:${PORT}`,
  );
});
