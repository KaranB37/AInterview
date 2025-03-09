import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.js",

  dialect: "postgresql",
  dbCredentials: {
    url:
      "postgresql://ai-interview_owner:npg_7sRUKokVh5Fe@ep-shrill-brook-a8ncsibk-pooler.eastus2.azure.neon.tech/ai-interview?sslmode=require",
  },
});
