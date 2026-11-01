import { getCollection, type CollectionEntry } from 'astro:content';

export async function gamesSorted() {
  return (await getCollection('games')).sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
export async function pagesOf(game: string) {
  return (await getCollection('pages', (p) => p.id.startsWith(`${game}/`))).sort((a, b) => a.data.order - b.data.order);
}
export const slugOf = (id: string) => id.split('/')[1];

/** サイドメニューの区分。並び順もこの順 */
export const SECTIONS = [
  { id: 'story', label: '物語', icon: 'lucide:book-open' },
  { id: 'characters', label: '登場人物', icon: 'lucide:users' },
  { id: 'theory', label: '考察', icon: 'lucide:search' },
] as const;
export const sectionLabel = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label])) as Record<(typeof SECTIONS)[number]['id'], string>;

export function groupBySection(pages: CollectionEntry<'pages'>[]) {
  return SECTIONS.map((s) => ({ ...s, pages: pages.filter((p) => p.data.section === s.id) })).filter((s) => s.pages.length);
}
