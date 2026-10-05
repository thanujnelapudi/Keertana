import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.SITE_URL || process.env.PUBLIC_SITE_URL || 'https://keertana.vercel.app';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        // Exclude redirect routes and offline page from sitemap
        return !page.includes('/songs/') && !page.includes('/offline/');
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
