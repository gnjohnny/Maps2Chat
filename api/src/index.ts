import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { leadRouter } from "./routes/leadRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {
  startIngestionScheduler,
  runIngestionDaemon,
} from "./daemon/scraper.js";

// Load environment configurations
dotenv.config();

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
