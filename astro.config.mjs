// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://routineforge.tech',
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});
