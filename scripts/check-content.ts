// コンテンツの検査。Astro のスキーマ検査（形）に加えて、形だけでは見つからない約束を確かめる。
//   bun scripts/check-content.ts            … 全部
//   bun scripts/check-content.ts <file...>  … 指定したファイルを含むゲームだけ（hook から呼ぶ）
// 失敗すると exit 1。メッセージは「どのファイルの何が・どう直すか」を1行で出す。
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parse } from 'yaml';
import { getIconData } from '@iconify/utils';
import gameIcons from '@iconify-json/game-icons/icons.json' with { type: 'json' };
import lucide from '@iconify-json/lucide/icons.json' with { type: 'json' };
import type { IconifyJSON } from '@iconify/types';

const ROOT = resolve(import.meta.dir, '..');
const GAMES = join(ROOT, 'src/content/games');
const sets: Record<string, IconifyJSON> = { gi: gameIcons as IconifyJSON, lucide: lucide as IconifyJSON };
const errors: string[] = [];
const rel = (p: string) => relative(ROOT, p);
const err = (file: string, msg: string) => errors.push(`${rel(file)}: ${msg}`);
const readYaml = (p: string) => parse(readFileSync(p, 'utf8'));

const args = process.argv.slice(2).map((a) => resolve(a));
const targetGames = new Set(
  args.length
    ? args.filter((a) => a.startsWith(GAMES)).map((a) => relative(GAMES, a).split('/')[0])
    : readdirSync(GAMES, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name),
);

/** 文字列中の icon 指定をすべて集める */
function iconRefs(text: string) {
  return [...text.matchAll(/\b(gi|lucide|asset):([a-z0-9-]+)/g)].map((m) => ({ set: m[1], name: m[2], ref: m[0] }));
}

for (const game of targetGames) {
  const dir = join(GAMES, game);
  const gameFile = join(dir, 'game.yaml');
  if (!existsSync(gameFile)) { err(dir, 'game.yaml が無い（add-game スキルの手順で作る）'); continue; }
  const g = readYaml(gameFile);

  // 1. 公式素材は、規約を確かめて official_assets: true にしたゲームだけ
  const assetsFile = join(dir, 'assets.yaml');
  const assets: { id: string; file: string; kind: string; source_url?: string }[] = existsSync(assetsFile) ? readYaml(assetsFile)?.assets ?? [] : [];
  const assetIds = new Set(assets.map((a) => a.id));
  for (const a of assets) {
    const f = join(ROOT, 'public/games', game, a.file);
    if (!existsSync(f)) err(assetsFile, `${a.id}: ファイルが無い public/games/${game}/${a.file}`);
    if (a.kind === 'official') {
      if (!g?.rights?.official_assets) err(assetsFile, `${a.id}: 公式素材だが game.yaml の rights.official_assets が false。規約を確かめるまで載せない`);
      if (!g?.rights?.official_assets_note) err(gameFile, 'rights.official_assets_note が無い。公式素材を載せる根拠（規約の許可か、運営者の判断か）を書く');
      if (!a.source_url) err(assetsFile, `${a.id}: 公式素材には source_url（取得元）が要る`);
    }
  }
  // public/games/<game>/ にあるのに assets.yaml に無いファイル（出所不明の画像）
  const pub = join(ROOT, 'public/games', game);
  if (existsSync(pub)) {
    const listed = new Set(assets.map((a) => a.file));
    for (const f of readdirSync(pub, { recursive: true }) as string[]) {
      if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(f) && !listed.has(f)) err(join(pub, f), 'assets.yaml に登録されていない画像。出所と kind を登録するか、消す');
    }
  }

  // 2. アイコンが実在するか、asset: が登録済みか
  const files = [gameFile, join(dir, 'characters.yaml'), ...['diagrams', 'pages'].flatMap((sub) => {
    const d = join(dir, sub);
    return existsSync(d) ? readdirSync(d).map((f) => join(d, f)) : [];
  })].filter(existsSync);
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    for (const r of iconRefs(text)) {
      if (r.set === 'asset') { if (!assetIds.has(r.name)) err(f, `${r.ref}: assets.yaml に無い`); continue; }
      if (!getIconData(sets[r.set], r.name)) err(f, `${r.ref}: アイコンが無い（https://icon-sets.iconify.design/${r.set === 'gi' ? 'game-icons' : 'lucide'}/ で名前を確かめる）`);
    }
    // 3. YAML の日付は文字列で書く（YAML は 2026-02-13 を Date にする）
    if (f.endsWith('.yaml')) {
      text.split('\n').forEach((line, i) => {
        if (/^\s*(when|released|checked_at):\s*\d{4}-\d{2}(-\d{2})?\s*$/.test(line)) err(f, `${i + 1}行目: 日付を "…" で囲む`);
      });
    }
  }

  // 4. 図の中の参照（駅・人物・系統）がつながっているか
  const diagDir = join(dir, 'diagrams');
  if (existsSync(diagDir)) for (const name of readdirSync(diagDir)) {
    const f = join(diagDir, name);
    const d = readYaml(f);
    const nodes: { id: string; at?: [number, number]; lane?: string; group?: string }[] = d.nodes ?? d.events ?? d.items ?? [];
    const ids = new Set(nodes.map((n) => n.id));
    if (ids.size !== nodes.length) err(f, 'id が重複している');
    for (const e of d.edges ?? []) for (const k of ['from', 'to']) if (!ids.has(e[k])) err(f, `edge の ${k}「${e[k]}」が nodes に無い`);
    const laneIds = new Set((d.lanes ?? d.groups ?? []).map((l: { id: string }) => l.id));
    for (const n of nodes) {
      if (n.lane && !laneIds.has(n.lane)) err(f, `${n.id}: lane「${n.lane}」が lanes に無い`);
      if (n.group && !laneIds.has(n.group)) err(f, `${n.id}: group「${n.group}」が groups に無い`);
    }
    // 同じマスに2つ置かない
    const seen = new Map<string, string>();
    for (const n of nodes) if (n.at) {
      const k = n.at.join(',');
      if (seen.has(k)) err(f, `${n.id} と ${seen.get(k)} が同じ位置 [${k}]`);
      seen.set(k, n.id);
    }
  }

  // 5. ページ: <Diagram> の id が実在する
  const pageDir = join(dir, 'pages');
  if (existsSync(pageDir)) for (const name of readdirSync(pageDir)) {
    const f = join(pageDir, name);
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/<Diagram id="([^"]+)"/g)) {
      const [gg, dn] = m[1].split('/');
      if (!existsSync(join(GAMES, gg, 'diagrams', `${dn}.yaml`))) err(f, `<Diagram id="${m[1]}"> の YAML が無い`);
    }
  }
}

if (errors.length) {
  console.error(`コンテンツ検査: ${errors.length} 件\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`コンテンツ検査 OK（${[...targetGames].join(', ') || '対象なし'}）`);
