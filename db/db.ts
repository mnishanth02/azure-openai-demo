import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/index";

const pool = new Pool({
  host: "aidemo2-pg.postgres.database.azure.com",
  port: 5432,
  user: "aidemo",
  password: "Azure_pass@2024",
  database: "ai_interview",
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });
