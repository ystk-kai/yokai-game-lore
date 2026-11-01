---
name: add-game
description: 考察サイトに新しいゲームを追加するときに使う。「〇〇を追加して」「次は〇〇の考察を作りたい」など、まだ src/content/games/ に無いゲームを扱い始めるとき。権利（公式画像を載せてよいか）の確認から、最初の路線図までを行う。
---

# ゲームを追加する

最初のページは必ず「本編の流れ」の路線図にする（DESIGN.md の Overview）。考察や人物はその後。

## 手順

1. **権利を調べる**（公開リポジトリなので最初にやる）
   - 権利者（開発・発売）と、ファンコンテンツ・ファンサイト・画像利用の規約を探す。動画だけのポリシーは画像の根拠にならない
   - 規約の該当条文を原文のまま `rights.guideline_quote` に写す。掲載を認める条文が無ければ `official_assets: false`
   - 権利表記（ストアやサイトの © 行）を `rights.notice` に写し、「非公式で承認を受けていない」旨を足す
2. **物語を調べる**: 章構成（公式・攻略サイトの章名）、各章の舞台と出来事、結末と分岐条件、人物。`imozuru` が使えるなら原文を `~/research/<game>-story/` に保存してから書く。DLC があれば DLC も同じ深さで調べる
3. **画像を集めるときは** `refs/<game>/images/` にだけ保存し、`SOURCES.tsv`（file / source_url / page / owner）に1行ずつ記録する。`official_assets: true` のゲームで掲載する画像だけを `public/games/<game>/` に置き、`assets.yaml` に登録する
4. `src/content/games/<game>/` を作る: `game.yaml` → `assets.yaml` → `diagrams/main-story.yaml`（type: flow）→ `pages/story.mdx`。既存の `reanimal/` を手本にする
5. 人物がそろったら `characters.yaml` と `diagrams/relations.yaml`、`pages/characters.mdx`
6. `bun run check` を通し、`bun run dev` で路線図を目で確かめる（ラベルのはみ出し・線の重なり・覆いの位置）

## 落とし穴

- YAML の日付は `"2026-02-13"` と引用符で囲む（囲まないと Date になり検査で落ちる）
- 駅のラベルは16字、線ラベルは12字まで。長い説明は `detail` へ
- 作中に固有名が無い人物の通称は、通称だと本文に書く
- 攻略サイトの章名が公式の日本語表記か分からないときは、出典を攻略サイトにして、そう書く
- 題名と description にネタバレを入れない
