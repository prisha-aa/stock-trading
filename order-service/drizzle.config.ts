import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./infrastructure/db/schema.ts", // Update path if needed
  out: "./drizzle",                            // Output folder for SQL
 dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
