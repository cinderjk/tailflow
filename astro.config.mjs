// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

const enablePlatformProxy = process.env.ASTRO_PLATFORM_PROXY === "true";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	adapter: cloudflare({
		platformProxy: enablePlatformProxy
			? {
				enabled: true,
				configPath: "wrangler.json",
			}
			: {
				enabled: false,
			},
	}),
});
