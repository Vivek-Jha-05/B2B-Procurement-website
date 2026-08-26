import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";

import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import leadRoutes from "./routes/leads";
import contactRoutes from "./routes/contact";
import resendWebhookRoutes from "./routes/resendWebhook";
import certificationRoutes from "./routes/certifications";
import categoryRoutes from './routes/categories';
import clientRoutes from './routes/clients';

const app = express();
app.set("trust proxy", 1);

// ──────────────────────────────────────────────
// Security middleware
// ──────────────────────────────────────────────
// Parse allowed origins — automatically switches based on NODE_ENV
const isProd = process.env.NODE_ENV === "production";
const defaultOrigin = isProd
  ? "https://b2b.vivek-jha.me,https://aprsvs.com"
  : "http://localhost:5173";
const rawOrigin = process.env.ALLOWED_ORIGIN || defaultOrigin;
const allowedOrigins = rawOrigin.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
        ],
        connectSrc: [
          "'self'",
          "https://*.vercel.app",
          "https://*.railway.app",
          "https://*.up.railway.app",
          "https://*.vivek-jha.me",
          "https://aprsvs.com",
          ...allowedOrigins,
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

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, same-origin)
      if (!origin) return callback(null, true);
      
      // Allow explicitly listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      
      // Allow any Vercel deployment (*.vercel.app)
      if (/\.vercel\.app$/i.test(origin)) return callback(null, true);
      
      // Allow any Railway deployment (*.up.railway.app or *.railway.app)
      if (/\.(up\.railway\.app|railway\.app)$/i.test(origin)) return callback(null, true);

      // Allow any subdomains of vivek-jha.me or aprsvs.com
      if (/\.(vivek-jha\.me|aprsvs\.com)$/i.test(origin)) return callback(null, true);
      
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
app.use(
  express.json({
    limit: "10kb",
    verify: (req, _res, buf) => {
      if (req.url?.startsWith("/api/email/webhooks/resend")) {
        (req as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buf);
      }
    },
  }),
);
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ──────────────────────────────────────────────
// Request logging
// ──────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  // Combined format for production log aggregation (Railway, Datadog, etc.)
  app.use(morgan("combined"));
} else {
  // Skip logging search queries in dev console to prevent logging of typed search keys
  app.use(morgan("dev", {
    skip: (req) => req.url.includes('search=')
  }));
}


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

app.use("/api/email/webhooks/resend", resendWebhookRoutes);

app.use("/api/certifications", certificationRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/clients', clientRoutes);

// 404 handler for unmatched API routes
app.use("/api/*", (_req: Request, res: Response) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// ──────────────────────────────────────────────
// Static frontend assets & SPA fallback
// ──────────────────────────────────────────────
const possibleClientPaths = [
  process.env.CLIENT_DIST_PATH,
  path.resolve(__dirname, "../../dist"),
  path.resolve(__dirname, "../../../dist"),
  path.resolve(process.cwd(), "dist"),
  path.resolve(process.cwd(), "../dist"),
].filter(Boolean) as string[];

const clientBuildPath = possibleClientPaths.find((p) =>
  fs.existsSync(path.join(p, "index.html")),
);

if (clientBuildPath) {
  console.log(`📦 Serving static frontend from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));

  // SPA fallback for client-side routing (React Router)
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 APR Services running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || "development"}]`,
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
