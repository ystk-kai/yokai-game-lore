// 手元の調査（~/research/<話題>/、imozuru で作ったもの）から、公開してよい部分だけを research/<話題>/README.md に書き出す。
// 書き出すもの: 問い・調査の論点・用語・人・媒体・次の手がかり（map.md）、経過（log.md）、出典の一覧（題名にあたるファイル名・元の URL・取得日）、取得できなかったもの。
// 書き出さないもの: sources/ の原文（他人の記事の全文の写しなので、公開リポジトリに置くと再配布になる）、report.html / digest.html（原文の前後を埋め込んでいる）。
// 使い方: bun run research:export   （話題の一覧は research/topics.txt）
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';

const ROOT = process.env.RESEARCH_DIR ?? join(homedir(), 'research');
const OUT = join(import.meta.dir, '..', 'research');
const topics = readFileSync(join(OUT, 'topics.txt'), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

type Fetch = { url: string; name?: string; status: string; at?: string; file?: string; reason?: string; error?: string };
const readJsonl = (p: string): Fetch[] => (existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);

// 原文のファイル名 → 元の URL と取得日。別の調査から写した原文もあるので、全部の調査の取得記録を引く
const known = new Map<string, Fetch>();
for (const d of readdirSync(ROOT, { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  for (const f of readJsonl(join(ROOT, d.name, 'fetch-log.jsonl'))) {
    if (f.status === 'OK' && f.file) known.set(basename(f.file), f);
  }
}

/** map.md の「原文（sources/）」の表から、ファイル名 → 元の URL を拾う（fetch.py を使わずに取った原文の URL はここにしか無い） */
function urlsFromMap(md: string): Map<string, string> {
  const m = new Map<string, string>();
  const sec = md.match(/\n## 原文（sources\/）([\s\S]*?)(?=\n## |$)/)?.[1] ?? '';
  for (const line of sec.split('\n')) {
    const url = line.match(/https?:\/\/[^\s|)>]+/)?.[0];
    if (!url) continue;
    for (const f of line.match(/[\w.-]+\.(?:md|txt|wiki|pdf)/g) ?? []) m.set(f, url);
  }
  return m;
}

/** map.md から「原文（sources/）」の表を除く（ファイル名と URL の表はここで作り直す） */
function mapWithoutSources(md: string): string {
  return md.replace(/\n## 原文（sources\/）[\s\S]*?(?=\n## |$)/, '\n').replace(/^# map: .*\n/, '').replace(/^(問い|題|読み): .*\n/gm, '').trim();
}

// すべての調査の map.md からも URL を拾う（写した原文の出どころが別の調査の表にあることがある）
const mapUrls = new Map<string, string>();
for (const d of readdirSync(ROOT, { withFileTypes: true })) {
  const p = join(ROOT, d.name, 'map.md');
  if (d.isDirectory() && existsSync(p)) for (const [f, u] of urlsFromMap(readFileSync(p, 'utf8'))) mapUrls.set(f, u);
}

// 記録に URL が無い原文は、手で書いた対応表（research/source-urls.tsv）から引く
const manualUrls = new Map(readFileSync(join(OUT, 'source-urls.tsv'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('\t') as [string, string]));

const esc = (s: string) => s.replace(/\|/g, '\\|');
const index: string[] = [];

for (const topic of topics) {
  const dir = join(ROOT, topic);
  if (!existsSync(join(dir, 'map.md'))) { console.warn(`map.md が無い: ${dir}`); continue; }
  const map = readFileSync(join(dir, 'map.md'), 'utf8');
  const log = existsSync(join(dir, 'log.md')) ? readFileSync(join(dir, 'log.md'), 'utf8').replace(/^# log: .*\n/, '').trim() : '';
  const question = map.match(/^問い: (.*)$/m)?.[1] ?? '';
  const title = map.match(/^題: (.*)$/m)?.[1] ?? map.match(/^# map: (.*)$/m)?.[1] ?? topic;

  const files = existsSync(join(dir, 'sources')) ? readdirSync(join(dir, 'sources')).filter((f) => /\.(md|txt|wiki|pdf)$/.test(f)).sort() : [];
  const rows = files.map((f) => {
    const k = known.get(f);
    const url = k?.url ?? mapUrls.get(f) ?? manualUrls.get(f);
    return `| ${esc(f.replace(/\.(md|txt|wiki|pdf)$/, ''))} | ${url ? `<${url}>` : '（記録なし）'} | ${k?.at?.slice(0, 10) ?? ''} |`;
  });
  const fails = readJsonl(join(dir, 'fetch-log.jsonl')).filter((f) => f.status !== 'OK');
  const failRows = [...new Map(fails.map((f) => [f.url, f])).values()].map((f) => `- <${f.url}> — ${esc(String(f.reason ?? f.error ?? f.status)).slice(0, 120)}`);
  const dates = [...files.map((f) => known.get(f)?.at?.slice(0, 10)).filter(Boolean)].sort() as string[];

  const out = [
    `# ${title}`,
    '',
    `> 手元の調査（\`~/research/${topic}/\`）から \`bun run research:export\` で書き出したもの。原文（\`sources/\`）は他人の記事の写しなので、このリポジトリには入れていない。出典は下の一覧の URL から読める。`,
    '',
    `- 問い: ${question}`,
    dates.length ? `- 原文の取得日: ${dates[0]} 〜 ${dates.at(-1)}` : '',
    `- 原文の数: ${files.length}（取得できなかったもの ${failRows.length}）`,
    '',
    mapWithoutSources(map),
    '',
    '## 出典の一覧',
    '',
    '調査の論点に書いた「ファイル名:行」は、この一覧のファイル名を指す（行番号は手元の写しのもの）。',
    '',
    '| ファイル名 | 元の URL | 取得日 |',
    '|---|---|---|',
    ...rows,
    '',
    ...(failRows.length ? ['## 取得できなかったもの', '', ...failRows, ''] : []),
    ...(log ? ['## 経過', '', log.replace(/^## /gm, '### '), ''] : []),
  ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');

  mkdirSync(join(OUT, topic), { recursive: true });
  writeFileSync(join(OUT, topic, 'README.md'), out + '\n');
  index.push(`| [${title}](${topic}/README.md) | ${esc(question)} | ${files.length} |`);
  console.log(`書き出した: research/${topic}/README.md（原文 ${files.length}・失敗 ${failRows.length}）`);
}

writeFileSync(join(OUT, 'README.md'), [
  '# 調査の記録',
  '',
  'サイトの物語・考察・権利の記述の根拠にした調査の記録です。調査は手元の `~/research/<話題>/`（imozuru スキルの形式）で行い、公開してよい部分だけを `bun run research:export` でここに書き出しています。',
  '',
  '- 入れているもの: 問い・調査の論点と原文の場所・用語・人・媒体・調べた経過・出典の一覧（URL と取得日）・取得できなかったもの',
  '- 入れていないもの: 保存した原文（記事や wiki の全文の写し。公開すると他人の文章の再配布になる）と、原文の前後を埋め込んだ抜き書きのページ',
  '',
  '| 調査 | 問い | 原文の数 |',
  '|---|---|---|',
  ...index,
  '',
].join('\n'));
console.log('書き出した: research/README.md');
