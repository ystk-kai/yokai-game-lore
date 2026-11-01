// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

// refs/（git 管理外の参照画像）を dev サーバーだけで /__refs/ に出す。build には入らない（公開しない）
const REFS = resolve('refs');
/** @type {Record<string, string>} */
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
/** @type {import('astro').AstroIntegration} */
const localRefs = {
  name: 'local-refs',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use('/__refs/', (req, res, next) => {
        const rel = normalize(decodeURIComponent((req.url ?? '').split('?')[0])).replace(/^([/\\]|\.\.)+/, '');
        const file = join(REFS, rel);
        if (!file.startsWith(REFS) || !existsSync(file) || !statSync(file).isFile() || !TYPES[extname(file).toLowerCase()]) return next();
        res.setHeader('Content-Type', TYPES[extname(file).toLowerCase()]);
        createReadStream(file).pipe(res);
      });
    },
  },
};

// GitHub Pages（プロジェクトページ）で配信する。リンクは必ず src/lib/url.ts の url() を通す
export default defineConfig({
  site: 'https://ystk-kai.github.io',
  base: '/yokai-game-lore',
  trailingSlash: 'always',
  integrations: [mdx(), localRefs],
});
