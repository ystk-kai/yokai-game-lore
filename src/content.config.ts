import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { analysis, assetsFile, charactersFile, diagram, game } from './schema';

const base = './src/content/games';
// id はフォルダの並びから作る: games = "<game>"、diagrams / pages = "<game>/<name>"
const byGame = ({ entry }: { entry: string }) => entry.split('/')[0];
const byGameAndName = ({ entry }: { entry: string }) => {
  const [g, , file] = entry.split('/');
  return `${g}/${file.replace(/\.(ya?ml|mdx?)$/, '')}`;
};

export const collections = {
  games: defineCollection({ loader: glob({ base, pattern: '*/game.yaml', generateId: byGame }), schema: game }),
  assets: defineCollection({ loader: glob({ base, pattern: '*/assets.yaml', generateId: byGame }), schema: assetsFile }),
  characters: defineCollection({ loader: glob({ base, pattern: '*/characters.yaml', generateId: byGame }), schema: charactersFile }),
  diagrams: defineCollection({ loader: glob({ base, pattern: '*/diagrams/*.yaml', generateId: byGameAndName }), schema: diagram }),
  pages: defineCollection({ loader: glob({ base, pattern: '*/pages/*.mdx', generateId: byGameAndName }), schema: analysis }),
};
