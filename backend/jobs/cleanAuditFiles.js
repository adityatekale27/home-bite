import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import envConfig from "../config/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, "../logs");
const daysOld = envConfig.AUDIT_CLEANUP_DAYS;

fs.readdir(logsDir, (err, files) => {
  if (err) return console.error("Error reading logs directory:", err);

  files.forEach((file) => {
    if (file.endsWith("-audit.json")) {
      const filePath = path.join(logsDir, file);

      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`Error checking ${file}:${err}`);

        const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
        if (ageInDays > daysOld) {
          fs.unlink(filePath, (err) => {
            if (err) return console.error(`Error deleting ${file}: ${err}`);
            console.log(`Deleted old audit file: ${file}`);
          });
        }
      });
    }
  });
});
