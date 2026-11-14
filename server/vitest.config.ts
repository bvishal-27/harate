import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

   include: ["src/tests/**/*.test.ts"],
hookTimeout: 120_000,
    testTimeout: 30_000,
    
    env: {
      NODE_ENV: "test",
      PORT: "4001",
      MONGO_URI: "mongodb://127.0.0.1:27017/harate_test",
    },
  },
});