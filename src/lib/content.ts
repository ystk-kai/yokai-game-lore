import { getCollection } from 'astro:content';

export async function gamesSorted() {
  return (await getCollection('games')).sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
export async function pagesOf(game: string) {
  return (await getCollection('pages', (p) => p.id.startsWith(`${game}/`))).sort((a, b) => a.data.order - b.data.order);
}
export const slugOf = (id: string) => id.split('/')[1];
export const kindLabel = { overview: '概要', story: '物語の流れ', characters: '人物', theory: '考察', timeline: '年表' } as const;
