// コンテンツのデータ形。content.config.ts と scripts/check-content.ts の両方がここを読む。
// 形を変えたら AGENTS.md の「データの形」と DESIGN.md の図解文法も確かめる。
import { z } from 'astro/zod';

/** 根拠の強さ。図では線の種類と枠の形で描き分ける（DESIGN.md「根拠の描き分け」） */
export const evidence = z.enum(['official', 'ingame', 'speculation']);
export type Evidence = z.infer<typeof evidence>;

/** 出典。url が無いときは where（作中の場所・章など）を必ず書く */
export const source = z
  .object({
    label: z.string(),
    url: z.url().optional(),
    where: z.string().optional(),
  })
  .refine((s) => s.url || s.where, { message: 'source には url か where のどちらかが要る' });

/**
 * アイコン指定。
 *  - "gi:<name>"      game-icons.net（CC BY 3.0・クレジットはサイトが自動で出す）
 *  - "lucide:<name>"  Lucide（ISC）
 *  - "asset:<id>"     そのゲームの assets.yaml に登録した画像
 */
export const iconRef = z.string().regex(/^(gi|lucide|asset):[a-z0-9-]+$/, 'icon は gi:名前 / lucide:名前 / asset:ID');

const lane = z.object({
  id: z.string(),
  label: z.string(),
  color: z.enum(['l1', 'l2', 'l3', 'l4', 'l5', 'l6']),
  icon: iconRef.optional(),
});

/* ---------- 図解 ---------- */

/** 物語の流れ（フローチャート）。場面のカードを at:[列, 段] に置き、矢印で結ぶ */
const flowNode = z.object({
  id: z.string(),
  /** カードの見出し。2行に収まる長さ。あらすじは detail に（カードに6行まで出る） */
  label: z.string().max(20, '見出しは20字まで。あらすじは detail に'),
  sub: z.string().max(12).optional(),
  /** 俯瞰の地図に出す短い名前（8字まで）。無ければ label を使う */
  short: z.string().max(8).optional(),
  detail: z.string().optional(),
  at: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
  lane: z.string(),
  kind: z.enum(['scene', 'boss', 'ending', 'branch', 'start']).default('scene'),
  icon: iconRef.optional(),
  evidence: evidence.default('ingame'),
  sources: z.array(source).default([]),
});
const flowEdge = z.object({
  from: z.string(),
  to: z.string(),
  /** カードの間に2行で収まる長さ（1行5字ほど） */
  label: z.string().max(12).optional(),
  evidence: evidence.default('ingame'),
});
export const flowDiagram = z.object({
  type: z.literal('flow'),
  /**
   * list: 上から下へ1本で読む（既定。本編の流れ向き。上に1行の地図が付く）
   * strip: 1行の横並びと短い説明だけ（順番だけを見せる考察向き）
   * grid: at の格子に置く（分岐・循環・比較を並べて見せる図だけ）
   */
  layout: z.enum(['list', 'strip', 'grid']).default('list'),
  /** grid のカードを小さくする（説明が短い図向き） */
  compact: z.boolean().default(false),
  title: z.string(),
  caption: z.string().optional(),
  lanes: z.array(lane).min(1),
  nodes: z.array(flowNode).min(1),
  edges: z.array(flowEdge).default([]),
});

/** 相関図。人物を at:[x, y] に置き、関係を線で結ぶ */
const relNode = z.object({
  id: z.string(),
  label: z.string().max(20),
  role: z.string().optional(),
  at: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
  group: z.string().optional(),
  icon: iconRef.optional(),
});
const relEdge = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().max(16),
  kind: z.enum(['bond', 'family', 'hostile', 'unknown']).default('bond'),
  directed: z.boolean().default(false),
  /** ラベルを置く位置（0=出どころ、1=行き先）。1つの人物から何本も出て重なるときに行き先寄りにする */
  label_at: z.number().min(0.2).max(0.9).default(0.6),
  evidence: evidence.default('ingame'),
});
export const relationsDiagram = z.object({
  type: z.literal('relations'),
  title: z.string(),
  caption: z.string().optional(),
  groups: z.array(lane).default([]),
  /** 段の間隔（px）。段の間の線にラベルが多いときに広げる */
  row_height: z.number().int().min(140).max(320).default(168),
  /** 列の間隔（px）。横に隣り合う人物の線にラベルを付けるときに広げる（カードの幅は 148px） */
  col_width: z.number().int().min(180).max(320).default(200),
  nodes: z.array(relNode).min(1),
  edges: z.array(relEdge).default([]),
});

/** 年表。出来事を order の順に縦に並べ、系統ごとに列を分ける（分岐は fork で） */
export const timelineDiagram = z.object({
  type: z.literal('timeline'),
  title: z.string(),
  caption: z.string().optional(),
  lanes: z.array(lane.extend({ fork: z.string().optional() })).min(1),
  events: z
    .array(
      z.object({
        id: z.string(),
        lane: z.string(),
        when: z.string().optional(),
        label: z.string().max(40),
        detail: z.string().optional(),
        icon: iconRef.optional(),
        evidence: evidence.default('ingame'),
        sources: z.array(source).default([]),
      }),
    )
    .min(1),
});

/** 発売順と作中の時系列の対応（Story Curves の考え方） */
export const orderDiagram = z.object({
  type: z.literal('order'),
  title: z.string(),
  caption: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().max(24),
        release: z.number().int(),
        story: z.number().int(),
        evidence: evidence.default('official'),
      }),
    )
    .min(2),
});

/** 配信・発売のスケジュール。横軸を実際の時間に比例させ、系統ごとに行を分ける */
export const scheduleDiagram = z.object({
  type: z.literal('schedule'),
  title: z.string(),
  caption: z.string().optional(),
  /** 「現在」の線を引く日（調べた日）。"YYYY-MM-DD" */
  now: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  lanes: z.array(lane).min(1),
  events: z
    .array(
      z.object({
        id: z.string(),
        lane: z.string(),
        /** 位置を決める日付。"YYYY-MM" か "YYYY-MM-DD" */
        date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'date は "YYYY-MM" か "YYYY-MM-DD"'),
        /** 図に出す日付の書き方（「2026-08-07（日本 8-08）」など）。無ければ date */
        date_label: z.string().optional(),
        label: z.string().max(14, '図のラベルは14字まで。説明は detail に'),
        detail: z.string().optional(),
        /** まだ起きていない予定。破線の白抜きで描く */
        planned: z.boolean().default(false),
        evidence: evidence.default('official'),
        sources: z.array(source).default([]),
      }),
    )
    .min(1),
});

export const diagram = z.discriminatedUnion('type', [flowDiagram, relationsDiagram, timelineDiagram, orderDiagram, scheduleDiagram]);
export type Diagram = z.infer<typeof diagram>;

/* ---------- ゲーム・素材・考察 ---------- */

export const game = z.object({
  title: z.string(),
  title_ja: z.string().optional(),
  order: z.number().default(100),
  developer: z.string(),
  publisher: z.string(),
  released: z.string(),
  /** トップの一覧に出す一言説明。どんなゲームかが1行で分かるように */
  tagline: z.string().max(40, '一言説明は40字まで'),
  summary: z.string().max(120, '概要は120字まで'),
  icon: iconRef,
  color: z.enum(['l1', 'l2', 'l3', 'l4', 'l5', 'l6']).default('l1'),
  /** 権利の扱い。公開サイトに公式素材を載せる根拠をここに残す */
  rights: z.object({
    holder: z.string(),
    guideline_url: z.url().optional(),
    /** 規約の該当箇所をそのまま写す（言い換えない） */
    guideline_quote: z.string().optional(),
    /** 公式素材（ゲーム画面・公式画像）を載せるか。false なら assets.yaml の kind: official は検査で落ちる */
    official_assets: z.boolean(),
    /** 載せる根拠。規約の許可か、規約に許可が無いまま運営者が判断したのかを正直に書く。official_assets: true なら必須 */
    official_assets_note: z.string().optional(),
    notice: z.string(),
    checked_at: z.string(),
  }),
});

export const asset = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  file: z.string(),
  alt: z.string(),
  kind: z.enum(['official', 'original']),
  source_url: z.url().optional(),
  credit: z.string(),
});
export const assetsFile = z.object({ assets: z.array(asset).default([]) });

export const analysis = z.object({
  title: z.string().max(40),
  /** ゲームの目次と OGP に出る */
  description: z.string().max(100),
  order: z.number().default(100),
  /** サイドメニューの区分。物語の本筋（本編・DLC）と考察を分ける（作者の決定） */
  section: z.enum(['story', 'characters', 'theory']),
  updated: z.coerce.date(),
});

/** 登場人物・クリーチャーの名鑑（characters.yaml）。見た目は文章でも書く（画像が無い人物もいるため） */
export const charactersFile = z.object({
  characters: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      name: z.string(),
      /** 文章の中の name を名鑑へのリンクにするか。一般の言葉と区別がつかない名前（少年・羊など）は false */
      autolink: z.boolean().default(true),
      /** name 以外にリンクにする呼び方（autolink に関係なくリンクにする） */
      aliases: z.array(z.string()).default([]),
      name_en: z.string().optional(),
      kind: z.enum(['protagonist', 'ally', 'creature', 'other']),
      icon: iconRef.optional(),
      role: z.string().max(40),
      looks: z.string().optional(),
      first_seen: z.string().optional(),
      /** 正体や結末など */
      secret: z.string().optional(),
      /** 登場する作品（本編・DLC）の id。pages の chapter と揃える */
      appears_in: z.array(z.string()).default([]),
      evidence: evidence.default('ingame'),
      sources: z.array(source).default([]),
      /** 見た目の画像がある公開ページ（攻略サイト・公式）。公開サイトではこのリンクを出す */
      looks_url: z.url().optional(),
      looks_label: z.string().optional(),
      /** 見た目の画像（assets.yaml の id）。thumb は顔のアイコン（正方形）、wide は見た目の横長画像 */
      image: z.object({ thumb: z.string().optional(), wide: z.string().optional() }).optional(),
    }),
  ),
});
