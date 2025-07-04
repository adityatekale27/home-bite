import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

/* Schema to validate environment variables */
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production").default("development"),
  PORT: Joi.number().positive().min(1).max(65535).default(5000),
  APP_VERSION: Joi.string().optional(),
  MONGODB_URI: Joi.string().required(),
  JWT_TOKEN_SECRET: Joi.string().min(32).required().messages({ "string.min": "Token secret must be at least 32 characters" }),
  JWT_TOKEN_TTL: Joi.number().positive().default(1800),
  JWT_TOKEN_ALGORITHM: Joi.string().default("HS256"),
  JWT_ISSUER: Joi.string().default("homebite"),
  AUDIT_CLEANUP_DAYS: Joi.number().positive().min(1).max(60).default(30),
  LOG_LEVEL: Joi.string().default("info"),
}).unknown(true);

const { error, value: envConfig } = envSchema.validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  const errorDetails = error.details.map((d) => d.message).join(", ");
  console.error("Environment validation failed:", { error: errorDetails });
  throw new Error("Invalid environment configuration");
}

export default envConfig;
