import dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: process.env.APP_PORT || 3000, // Default to 3000 if not provided
  },
  db: {
    name: process.env.DB_NAME,
    baseUrl: process.env.DB_BASE_URL,
    port: process.env.DB_PORT,
  },
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10), // Convert to a number
  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;
