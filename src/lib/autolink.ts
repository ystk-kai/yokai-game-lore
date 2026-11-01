// 文章の中の人物・怪物の名前を、名鑑（<Characters> を置いたページ）のカードへのリンクにする。
// - 一般の言葉と区別がつかない名前（少年・羊など）は characters.yaml で autolink: false にして対象から外す
// - 長い名前から先に当てる（「もう1人の囚人」を「囚人」より先に）
// - 1つの文章では、同じ人物は最初の1回だけリンクにする。自分のカードの中では自分にリンクしない
import { getCollection, getEntry } from 'astro:content';
import { url } from './url';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export type Linker = ((text: string, self?: string) => string) & {
  /** HTML の文字の部分だけを置き換える（タグ・既存のリンク・コードの中は触らない）。本文の段落用 */
  html: (html: string) => string;
};

export async function makeLinker(game: string): Promise<Linker> {
  const chars = (await getEntry('characters', game))?.data.characters ?? [];
  const page = (await getCollection('pages', (p) => p.id.startsWith(`${game}/`) && !!p.body?.includes('<Characters'))).at(0);
  const terms = chars
    .flatMap((c) => [...(c.autolink ? [c.name] : []), ...c.aliases].map((name) => ({ name, id: c.id, label: c.name })))
    .sort((a, b) => b.name.length - a.name.length);
  if (!page || !terms.length) return Object.assign((t: string) => esc(t), { html: (h: string) => h });
  const base = url(`games/${page.id}`);
  const byName = new Map(terms.map((t) => [t.name, t]));
  const re = new RegExp(terms.map((t) => escRe(t.name)).join('|'), 'g');
  // 文字列の中の名前を置き換える。escape は、素の文字列なら esc、すでに HTML の文字なら何もしない
  const replace = (text: string, used: Set<string>, self: string | undefined, escape: (s: string) => string) => {
    let out = '', last = 0;
    for (const m of text.matchAll(re)) {
      const t = byName.get(m[0])!;
      out += escape(text.slice(last, m.index));
      out += t.id === self || used.has(t.id) ? escape(m[0]) : `<a class="char-link" href="${base}#ch-${t.id}" title="${esc(t.label)}の説明へ">${escape(m[0])}</a>`;
      used.add(t.id);
      last = m.index! + m[0].length;
    }
    return out + escape(text.slice(last));
  };
  const keep = (s: string) => s;
  const fn = (text: string, self?: string) => replace(text, new Set(), self, esc);
  const html = (h: string) => {
    const used = new Set<string>();
    let skip = 0;
    return h.split(/(<[^>]+>)/).map((part) => {
      if (part.startsWith('<')) {
        if (/^<(a|code|pre)[\s>]/i.test(part)) skip++;
        else if (/^<\/(a|code|pre)>/i.test(part)) skip = Math.max(0, skip - 1);
        return part;
      }
      return skip ? part : replace(part, used, undefined, keep);
    }).join('');
  };
  return Object.assign(fn, { html });
}
