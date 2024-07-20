import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { z } from "zod";

config();
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    AZURE_TEXT_TRANSLATION: z.string().min(1),
    AZURE_TEXT_TRANSLATION_KEY: z.string().min(1),
    AZURE_TEXT_LOCATION: z.string().min(1),
    AZURE_API_KEY: z.string().min(1),
    AZURE_ENDPOINT: z.string().min(1),
    AZURE_DEPLOYMENT_NAME: z.string().min(1),
    AZURE_DEPLOYMENT_COMPLETION_NAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
