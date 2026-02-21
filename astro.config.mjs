import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://nimwver.me",
  integrations: [mdx(), sitemap(), pagefind()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "one-dark-pro",
      },
      defaultColor: false,
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});