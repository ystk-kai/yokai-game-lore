---
name: Yokai Game Lore
colors:
  bg: "#111318"
  surface: "#1a1d24"
  ink: "#e8eaef"
  muted: "#a3aab8"
  rule: "#363b47"
  accent: "#ff7a5c"
  lane-l1: "#ff7a5c"
  lane-l2: "#6aa6ff"
  lane-l3: "#45c993"
  lane-l4: "#e3a640"
  lane-l5: "#bb93ff"
  lane-l6: "#44c6d1"
typography:
  body:
    fontFamily: '-apple-system, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", YuGothic, Meiryo, "Noto Sans JP", sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
  h1:
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.4
    fontFeature: '"palt"'
  label:
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.35
spacing:
  unit: 4px
  route-line: 6px
  link-line: 2px
  measure: 40em
rounded:
  card: 6px
  pill: 999px
components:
  station:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    width: 164px
    height: 76px
  station-ending:
    backgroundColor: "{colors.lane-l6}"
    textColor: "{colors.surface}"
  edge-label:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.pill}"
---

# Yokai Game Lore のデザイン言語

トークンの実体は `src/styles/tokens.css`。この文書と食い違ったら、両方を同じコミットで直す。

## Overview

**夜の駅に掲げられた、裏から光る路線図の案内板**を参照物にする。暗い面に発光するような太い色線が走り、駅は面より一段明るい札、乗り換えは線の合流で示す。サイトはダークテーマだけで、明るいテーマは持たない（作者の決定）。ゲームの物語は「場面（駅）を順にたどる旅」として描く。

読み手は、ゲームを遊び終えた人か、途中まで遊んだ人。最初に知りたいのは「全体がどうつながっているか」なので、どのゲームでも**最初のページは本編の路線図**にする。文章は図の補足に回す。

見え方はゲームごとに変えない。ゲームの雰囲気（ホラー、ファンタジー）は、アイコンの選び方と文章で出す。色・書体・図の文法はサイトで1つにする。

## Colors

- ダークテーマのみ。地は青みのある墨色（`bg`）で、図とカードはそれより一段明るい面（`surface`）に載せる。純黒（#000）にしない
- 朱（`accent`）は、リンクと強調だけに使う。面を朱で塗らない
- **系統色 `lane-l1`〜`l6`** は路線の色。どれも `bg`・`surface` 地で 6.5:1 以上あり、系統色の面に `surface` 色の文字を載せても 6.5:1 以上なので、線にも文字にも面にも使える。1つの図で使う系統は6つまで
- 色の意味は図ごとに凡例で決める（舞台、勢力、作品など）。図をまたいで同じ意味を持たせない。例外は相関図の関係の種類（藍＝絆・協力、緑＝家族、朱＝敵対、灰＝不明）で、これはサイト全体で固定する

## Typography

- ゴシック1種類だけ（トークンの `body` のスタック）。`system-ui` を先頭に置かない。明朝・serif の指定をしない
- 本文 16px・行の高さ 1.75・1 行 40 字前後。図のラベルと注記だけ 14px（`label`）にする
- 斜体を使わない（`em` は太字に置き換えている）。見出しには `palt` をかける。本文には `line-break: strict` をかける
- 年や日付の数字には `.num`（等幅数字）を使う

## Layout

- 本文の幅は `measure`（40em）。図は本文より広く取り、横に収まらないときは図の中だけを横スクロールにする（ページ全体を横に揺らさない）
- 余白は 4px の倍数（`--space-*`）
- 図の座標は格子で決める。駅・人物は `at: [列, 段]` で置き、文字の幅から位置を計算しない（日本語のラベル幅は推定すると外れる）

## Elevation & Depth

影を使わない。重なりは線（1px の `rule`）と、地より一段明るい面（`surface`）で表す。ホバーでは、系統色を薄く広げた輪を出す。

## Shapes

- 札・カードの角丸は 6px。線ラベルは丸い錠剤の形
- 路線は 6px の太線で、端は丸くする。関係線は 2px（敵対だけ 3px）

## Components

図は4種類。新しい図を足す前に、この4つで描けないかを確かめる。

| 図 | データ（`diagrams/*.yaml` の `type`） | 使いどころ |
|---|---|---|
| 路線図 | `flow` | 章・場面の流れ、分岐、エンディング |
| 相関図 | `relations` | 人物・勢力の関係 |
| 年表 | `timeline` | 作中の年代、配信の順、並行する系統 |
| 発売順と作中の順 | `order` | シリーズの発売順と物語の順のずれ |

**根拠の描き分け**（全部の図で共通）

| 根拠 | 印 | 線 |
|---|---|---|
| `official` 公式の資料・発表 | 黒丸 | 実線 |
| `ingame` 作中の描写・テキスト | 白丸 | 実線 |
| `speculation` 推測 | 破線の丸 | 破線。相関図のラベルには「？」が付く |

**路線図の文法**

- 駅の札は幅固定で2行まで（ラベルは16字以内）。章番号などは `sub`、詳しい説明は `detail` に書き、図の下の「駅ごとの説明と出典」に出す
- `kind` で札を変える: `start`・`ending` は系統色の面、`boss` は二重枠、`branch` は分岐
- 横に4駅を超えるときは段を折り返す（1段目 左→右、2段目 右→左）。折り返しの縦線は同じ列で結ぶ
- 線ラベルは12字以内。駅と駅の間に2行で収まる長さにする

**アイコン**

- 既定は game-icons.net（`gi:`、CC BY 3.0）。UI の小物だけ Lucide（`lucide:`）
- 公式アイコン・画像は、そのゲームの規約で掲載が認められているときだけ `asset:` で使う（AGENTS.md「権利」）。認められていないゲームは、汎用アイコンと「見た目」の文章で描く
- 1つの図で、同じアイコンを別の意味に使わない

**ネタバレの覆い**: `<Spoiler scope="第3章クリア後">`。scope に範囲を必ず書く。図の中の札・線ラベルにも `spoiler` を付けられる。

## Do's and Don'ts

- Do: どのゲームも、最初のページは本編の路線図にする
- Do: サイトのトップはゲーム名の一覧だけにする（キャッチコピー・説明文を置かない。作者の決定）
- Do: 図の下に、同じ内容を文章で読める一覧を付ける（色と線が見えない人のため）
- Don't: 図を1枚の画像（PNG・生成画像）で作らない。データ（YAML）から描く
- Don't: Mermaid など、日本語ラベルの幅を自動計算する図の道具を使わない
- Don't: 紫から青へのグラデーション、同じ形のカードを並べただけの一覧、影の重ねがけ
