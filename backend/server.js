import express from "express";
import cors from "cors";
import helmet from "helmet";
import requestId from "express-request-id";
import envConfig from "./config/env.js";
import { logger } from "./utils/logger.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from './routes/auth.route.js'
import customerRoutes from "./routes/customer.route.js";
import chefRoutes from "./routes/business.route.js";
import orderRoutes from "./routes/order.route.js";
import ratingRoutes from "./routes/rating.route.js";
import adminRoutes from "./routes/admin.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestId());

// Satatic files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "HomeBite Delivery API is running!", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
console.log("hello")

// Start server
const server = app.listen(envConfig.PORT, () => {
  logger.info(`Server is running on port ${envConfig.PORT}`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close((err) => {
    if (err) {
      logger.error("Error during server close:", err);
      process.exit(1);
    }

    logger.info("Server closed successfully");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

export default server