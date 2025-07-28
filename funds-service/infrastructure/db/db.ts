import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import * as schema from "./schema"; 

config(); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

export const db = drizzle(pool); 
export type DrizzleTx = Parameters<Parameters<typeof db.transaction>[0]>[0];