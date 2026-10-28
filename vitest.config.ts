import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    env: { DATABASE_URL: "file:./test.db" },
    fileParallelism: false, // test files share one database, so run them one at a time
  },
});
