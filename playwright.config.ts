import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:5173",
    channel: "msedge",
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
});
