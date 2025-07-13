import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config(); 

export default {
  schema: "./infrastructure/db/schema.ts",
  out: "./drizzle/migrations", 
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
