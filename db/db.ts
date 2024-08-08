import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/env";
import * as schema from "./schema/index";

const pool = new Pool({
  host: env.PG_HOST,
  port: +env.PG_PORT,
  user: env.PG_USERNAME,
  database: env.PG_DATABASE,
  password: env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema });
