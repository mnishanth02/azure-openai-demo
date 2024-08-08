import type { Config } from "drizzle-kit";

import { env } from "./env";

export default {
  schema: "./db/schema/index.ts",
  dialect: "postgresql",
  out: "./db/migrations",
  dbCredentials: {
    host: env.PG_HOST,
    port: +env.PG_PORT,
    user: env.PG_USERNAME,
    database: env.PG_DATABASE,
    password: env.PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;
