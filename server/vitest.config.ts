import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

   include: ["src/tests/**/*.test.ts"],

    env: {
      NODE_ENV: "test",
      PORT: "4001",
      MONGO_URI: "mongodb://127.0.0.1:27017/harate_test",
    },
  },
});