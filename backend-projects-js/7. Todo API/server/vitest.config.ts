import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.ts"], // Fixed: Removed 'src' to match your folder structure
    environment: "node",
  },
});
