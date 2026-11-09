// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import { SITE_URL } from "./src/consts.ts";
import { isNoindexRoute } from "./src/utils/seo.ts";

import mdx from "@astrojs/mdx";
import markdoc from "@astrojs/markdoc";

export default defineConfig({
  site: SITE_URL,
  adapter: node({ mode: "standalone" }),
  env: {
    schema: {
      NEON_FUNCTION_CONTACT_BASE_URL: envField.string({ context: "server", access: "public" }),
      NEON_AUTH_BASE_URL: envField.string({ context: "server", access: "secret" }),
      NEON_AUTH_COOKIE_SECRET: envField.string({ context: "server", access: "secret" }),
      NEON_REALTIME_URL: envField.string({ context: "server", access: "secret" }),
      NEON_REALTIME_SECRET: envField.string({ context: "server", access: "secret" }),
      DATABASE_URL: envField.string({ context: "server", access: "secret" }),
    },
  },
  integrations: [sitemap({
    filter: (page) => !isNoindexRoute(new URL(page).pathname),
  }), mdx(), markdoc()],
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/inter-regular.woff2"],
          },
        ],
      },
    },
  ],
  vite: { build: { cssTarget: "safari15.4" } },
});