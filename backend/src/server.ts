import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import leadRoutes from "./routes/leads";
import contactRoutes from "./routes/contact";
import certificationRoutes from "./routes/certifications";

const app = express();

// ──────────────────────────────────────────────
// Security middleware
// ──────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
        ],
        connectSrc: [
          "'self'",
          "https://b2b-procurement-website-production.up.railway.app",
          "https://b2-b-procurement-website.vercel.app",
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests:
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false, // Cloudinary images need this off
  }),
);

// Parse allowed origins — supports comma-separated list for multiple Vercel previews
const rawOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const allowedOrigins = rawOrigin.split(",").map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ──────────────────────────────────────────────
// Parsing & compression middleware
// ──────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ──────────────────────────────────────────────
// Request logging
// ──────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  // Combined format for production log aggregation (Railway, Datadog, etc.)
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// ──────────────────────────────────────────────
// NoSQL injection sanitization
// ──────────────────────────────────────────────
app.use(mongoSanitize());

// ──────────────────────────────────────────────
// Rate limiting
// ──────────────────────────────────────────────

// Global API rate limit: 100 req / 15 min
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
  },
  skip: (req) => req.path === "/api/health",
});

// Stricter limit for auth: 10 req / 1 hr
const authRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again in an hour.",
  },
});

// Stricter limit for contact: 5 req / 1 hr
const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many submissions. Please try again later.",
  },
});

app.use("/api", globalRateLimit);

// ──────────────────────────────────────────────
// Health check
// ──────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────
app.use("/api/auth/login", authRateLimit);
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/contact", contactRateLimit, contactRoutes);

app.use("/api/certifications", certificationRoutes);

// 404 handler for unmatched API routes
app.use("/api/*", (_req: Request, res: Response) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// ──────────────────────────────────────────────
// Global error handler (must be last)
// ──────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  errorHandler(err, req, res, next);
});

// ──────────────────────────────────────────────
// Start server
// ──────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "3001", 10);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🚀 APR Services API running on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`,
      );
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();

export default app;
