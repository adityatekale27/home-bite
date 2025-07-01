import express from "express";
import cors from "cors";
import helmet from "helmet";
import requestId from "express-request-id";
import envConfig from "./config/env.js";
import { logger } from "./utils/logger.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestId());

// Sample route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Grabmio API" });
});

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
