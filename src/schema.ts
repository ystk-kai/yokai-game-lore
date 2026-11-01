// コンテンツのデータ形。content.config.ts と scripts/check-content.ts の両方がここを読む。
// 形を変えたら AGENTS.md の「データの形」と DESIGN.md の図解文法も確かめる。
import { z } from 'astro/zod';

/** 根拠の強さ。図では線の種類と駅の形で描き分ける（DESIGN.md「根拠の描き分け」） */
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

/** ネタバレの範囲。「第3章クリア後」のように、どこまで進めた人向けかを書く */
export const spoiler = z.string().min(2).optional();

const lane = z.object({
  id: z.string(),
  label: z.string(),
  color: z.enum(['l1', 'l2', 'l3', 'l4', 'l5', 'l6']),
  icon: iconRef.optional(),
});

/* ---------- 図解 ---------- */

/** 物語の流れ（路線図）。駅を at:[列, 段] に置き、線で結ぶ */
const flowNode = z.object({
  id: z.string(),
  /** 駅の札は幅固定で2行まで。長い説明は detail に */
  label: z.string().max(16, 'ラベルは16字まで（駅の札は2行）。詳しくは detail に'),
  sub: z.string().max(12).optional(),
  detail: z.string().optional(),
  at: z.tuple([z.number().int().min(0), z.number().int().min(0)]),
  lane: z.string(),
  kind: z.enum(['scene', 'boss', 'ending', 'branch', 'start']).default('scene'),
  icon: iconRef.optional(),
  evidence: evidence.default('ingame'),
  spoiler,
  sources: z.array(source).default([]),
});
const flowEdge = z.object({
  from: z.string(),
  to: z.string(),
  /** 駅の間に2行で収まる長さ（1行6字ほど） */
  label: z.string().max(12).optional(),
  evidence: evidence.default('ingame'),
});
export const flowDiagram = z.object({
  type: z.literal('flow'),
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
  spoiler,
});
const relEdge = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().max(16),
  kind: z.enum(['bond', 'family', 'hostile', 'unknown']).default('bond'),
  directed: z.boolean().default(false),
  evidence: evidence.default('ingame'),
  spoiler,
});
export const relationsDiagram = z.object({
  type: z.literal('relations'),
  title: z.string(),
  caption: z.string().optional(),
  groups: z.array(lane).default([]),
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
        spoiler,
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

export const diagram = z.discriminatedUnion('type', [flowDiagram, relationsDiagram, timelineDiagram, orderDiagram]);
export type Diagram = z.infer<typeof diagram>;

/* ---------- ゲーム・素材・考察 ---------- */

export const game = z.object({
  title: z.string(),
  title_ja: z.string().optional(),
  order: z.number().default(100),
  developer: z.string(),
  publisher: z.string(),
  released: z.string(),
  summary: z.string().max(120, '概要は120字まで。ネタバレを入れない'),
  icon: iconRef,
  color: z.enum(['l1', 'l2', 'l3', 'l4', 'l5', 'l6']).default('l1'),
  /** 権利の扱い。公開サイトに公式素材を載せる根拠をここに残す */
  rights: z.object({
    holder: z.string(),
    guideline_url: z.url().optional(),
    /** 規約の該当箇所をそのまま写す（言い換えない） */
    guideline_quote: z.string().optional(),
    /** 公式素材を載せてよいと判断したか。false なら assets.yaml の公開素材は検査で落ちる */
    official_assets: z.boolean(),
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
  /** 一覧と OGP に出る。題名と同じくネタバレを入れない（Zelda Universe の方針に倣う） */
  description: z.string().max(100),
  order: z.number().default(100),
  /** このページを読む前提。例「本編クリア後」。none はネタバレなし */
  spoiler_scope: z.string(),
  kind: z.enum(['overview', 'story', 'characters', 'theory', 'timeline']),
  updated: z.coerce.date(),
});

/** 登場人物・クリーチャーの名鑑（characters.yaml）。見た目は文章でも書く（画像が無い人物もいるため） */
export const charactersFile = z.object({
  characters: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      name: z.string(),
      name_en: z.string().optional(),
      kind: z.enum(['protagonist', 'ally', 'creature', 'other']),
      icon: iconRef.optional(),
      role: z.string().max(40),
      looks: z.string().optional(),
      first_seen: z.string().optional(),
      /** 正体や結末など。必ず spoiler で範囲を書く */
      secret: z.string().optional(),
      spoiler,
      /** 登場する作品（本編・DLC）の id。pages の chapter と揃える */
      appears_in: z.array(z.string()).default([]),
      evidence: evidence.default('ingame'),
      sources: z.array(source).default([]),
    }).refine((c) => !c.secret || c.spoiler, { message: 'secret を書くときは spoiler（範囲）も書く' }),
  ),
});
