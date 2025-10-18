import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value ?? fallback!;
}

const ENV = {
  API_KEY: getEnv("API_KEY"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  PORT: parseInt(getEnv("PORT", "3000")),
  NODE_ENV: getEnv("NODE_ENV", "development"),
};

export default ENV;
