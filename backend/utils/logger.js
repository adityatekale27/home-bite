import morgan from "morgan";
import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";
import envConfig from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Ensure logs directory exists */
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/* Log format for winston */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

/* Console log format for development */
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";
    return `${timestamp} [${service || "HomeBite"}] ${level}: ${message} ${metaStr}`;
  })
);

/* Daily rotate file transport */
const createDailyRotateTransport = (filename, level = "info") => {
  return new DailyRotateFile({
    filename: path.join(logsDir, `${filename}-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxFiles: "30d",
    maxSize: "20m",
    level,
    format: logFormat,
    auditFile: path.join(logsDir, `${filename}-audit.json`),
  });
};

/* Winston logger configuration */
const logger = winston.createLogger({
  level: envConfig.LOG_LEVEL,
  defaultMeta: {
    service: "homebite-api",
    version: envConfig.APP_VERSION,
    environment: envConfig.NODE_ENV,
  },
  transports: [createDailyRotateTransport("error", "error"), createDailyRotateTransport("combined")],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
      format: logFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
      format: logFormat,
    }),
  ],
  exitOnError: false,
});

/* Console transport for development */
if (envConfig.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: "debug",
    })
  );
}

/* Custom morgan tokens */
morgan.token(
  "real-ip",
  (req) =>
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
);

morgan.token("user-id", (req) => (req.user ? req.user.id : "anonymous"));
morgan.token("request-id", (req) => req.requestId || "no-request-id");

/* Morgan format for detailed loggin */
const morganFormat =
  process.env.NODE_ENV === "production"
    ? ':real-ip - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :request-id'
    : ":method :url :status :response-time ms - :res[content-length]";

/* Morgan configuration */
const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      // Remove trailing newLine
      const logMessage = message.trim();

      // Parse status code to determine log level
      const statusMatch = logMessage.match(/\s(\d{3})\s/);
      const statusCode = statusMatch ? parseInt(statusMatch[1]) : 200;

      let logLevel = "http";
      if (statusCode >= 500) logLevel = "error";
      else if (statusCode >= 400) logLevel = "warn";
      else if (statusCode >= 300) logLevel = "info";

      logger.log(logLevel, logMessage, { type: "http-access" });
    },

    skip: (req, res) => {
      // Skip logging for health check
      if (envConfig.NODE_ENV === "production") {
        return req.url === "/health" || req.url === "/ping";
      }
      return false;
    },
  },
});

// Graceful shutdown handler
const gracefulShutdown = () => {
  logger.info("Initiating graceful shutdown...");
  for (const transport of logger.transports) {
    transport.close();
  }
  console.log("Logger closed gracefully");
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export { logger, morganMiddleware };
