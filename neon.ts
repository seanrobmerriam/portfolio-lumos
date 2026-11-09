import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Declare your Neon services here
  preview: {
    // Browser origins allowed to open the Live SQL WebSocket (the /admin page)
    realtime: { allowedOrigins: ["http://localhost:4321", "http://localhost:4330"] },
  },
  auth: true,
  functions: {
    contact: {
      name: "Contact form",
      source: "./functions/contact.ts",
      env: { CONTACT_ALLOWED_ORIGINS: process.env.CONTACT_ALLOWED_ORIGINS! },
    },
  },
  buckets: {
    // "private" is the default; use "public_read" for anonymous reads
    assets: { access: "private" },
  },
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
