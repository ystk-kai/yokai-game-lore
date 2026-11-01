---
name: add-game
description: 考察サイトに新しいゲームを追加するときに使う。「〇〇を追加して」「次は〇〇の考察を作りたい」など、まだ src/content/games/ に無いゲームを扱い始めるとき。権利（公式画像を載せてよいか）の確認から、最初の流れ図までを行う。
---

# ゲームを追加する

最初のページは必ず「本編の流れ」の図（type: flow）にする（DESIGN.md の Overview）。考察や人物はその後。

## 手順

1. **権利を調べる**（公開リポジトリなので最初にやる）
   - 権利者（開発・発売）と、ファンコンテンツ・ファンサイト・画像利用の規約を探す。動画だけのポリシーは画像の根拠にならない
   - 規約の該当条文を原文のまま `rights.guideline_quote` に写す（言い換えない。保存した原文と照合する）。許可の条件（対象が個人か、投稿先の種類、自分で撮ったものか、営利かどうか、画像の種類）を1つずつ確かめ、このサイトに当てはまるかを `official_assets_note` に書く。画像を載せるかは作者に確かめ、載せるなら根拠（規約の許可／運営者の判断）を `official_assets_note` に書く
   - 権利表記（ストアやサイトの © 行）を `rights.notice` に写し、「非公式で承認を受けていない」旨を足す
2. **物語を調べる**: 章構成（公式・攻略サイトの章名）、各章の舞台と出来事、結末と分岐条件、人物。`imozuru` が使えるなら原文を `~/research/<game>-story/` に保存してから書く。DLC があれば DLC も同じ深さで調べる
3. **画像を集めるときは** まず `refs/<game>/images/` に保存し、`SOURCES.tsv`（file / source_url / page / owner）に1行ずつ記録する。載せる画像だけを `public/games/<game>/` に写して `assets.yaml` に登録し、`characters.yaml` の `image: { thumb, wide }` から参照する
4. `src/content/games/<game>/` を作る: `game.yaml`（トップに出る一言説明 `tagline`、シリーズや DLC があれば作品の一覧 `titles` を含む） → `assets.yaml` → `diagrams/main-story.yaml`（type: flow）→ `pages/story.mdx`。既存の `reanimal/` を手本にする
5. 人物がそろったら `characters.yaml` と `diagrams/relations.yaml`、`pages/characters.mdx`
6. `bun run check` を通し、`bun run dev` で流れ図を目で確かめる（ラベルのはみ出し・線の重なり）

## 落とし穴

- 固有名は日本語版の公式の表記で書く（英語版の名前は名鑑の `name_en` だけに）。日本語の資料で確かめられない名前は、確かめられないと書く
- シリーズは、作中の時系列（流れ図）・作品ごとの物語の流れ（流れ図）・人物の登場作品の表（Appearances）を分けて作る。縦の年表（timeline）は使わない。作品をまたぐ順番を、根拠なしに矢印でつながない
- 物語のページに考察を書かない。読み方は section: theory のページへ

- YAML の日付は `"2026-02-13"` と引用符で囲む（囲まないと Date になり検査で落ちる）
- 場面の見出しは20字、矢印のラベルは12字まで。あらすじは `detail` へ（カードに6行まで出る）
- 作中に固有名が無い人物の通称は、通称だと本文に書く
- 攻略サイトの章名が公式の日本語表記か分からないときは、出典を攻略サイトにして、そう書く
