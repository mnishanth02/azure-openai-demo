import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema/index.ts",
  dialect: "postgresql",
  out: "./db/migrations",
  dbCredentials: {
    user: "aidemo",
    password: "Azure_pass@2024",
    host: "aidemo2-pg.postgres.database.azure.com",
    port: 5432,
    database: "ai_interview",
  },
} satisfies Config;
