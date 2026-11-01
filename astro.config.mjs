// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// GitHub Pages（プロジェクトページ）で配信する。リンクは必ず src/lib/url.ts の url() を通す
export default defineConfig({
  site: 'https://ystk-kai.github.io',
  base: '/yokai-game-lore',
  trailingSlash: 'always',
  integrations: [mdx()],
});
