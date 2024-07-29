import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema/index.ts",
  dialect: "postgresql",
  out: "./db/migrations",
  dbCredentials: {
    host: "aidemo2-pg.postgres.database.azure.com",
    port: 5432,
    user: "aidemo",
    database: "ai_interview",
    password: "Azure_pass@2024",
    ssl: {
      rejectUnauthorized: false,
    },
  },
} satisfies Config;
