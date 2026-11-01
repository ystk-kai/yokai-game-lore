---
name: lore-page
description: 既存のゲームの考察ページや図解（路線図・相関図・年表・発売順）を追加・修正するときに使う。「DLC の流れを足して」「相関図を直して」「この考察を追加して」など、src/content/games/<game>/ の pages・diagrams・characters を書き換える作業。
---

# 考察ページと図を書く

## どの図で描くか

| 描きたいもの | type | 置き方 |
|---|---|---|
| 章・場面の流れ、分岐、結末 | `flow` | 駅を `at: [列, 段]`。横4駅で折り返す |
| 人物・勢力の関係 | `relations` | グループごとに段を分ける（枠が重ならないように） |
| 年代・配信順・並行する系統 | `timeline` | 出来事を順に並べ、分岐する系統は `fork` |
| 発売順と作中の順のずれ | `order` | `release` と `story` に順番の数 |

形は `src/schema.ts`、見た目の文法は DESIGN.md の Components。

## 書き方

- 駅・人物・関係・出来事に `evidence`（official / ingame / speculation）を付ける。迷ったら弱いほう
- 事実には `sources`（label と url、url が無ければ `where`）。攻略サイト由来なら攻略サイトを出典にする
- 推測は `<Theory level="speculation" who="誰の説か">` で、作中の描写と分ける
- 出典が食い違うときは両方を書く。路線図なら推測の破線を2本引く（`reanimal/diagrams/dlc-position.yaml` が手本）
- ネタバレは `spoiler: 範囲` か `<Spoiler scope="範囲">`。ページの `spoiler_scope` も更新する
- MDX では `Diagram` `Characters` `Spoiler` `Theory` `Icon` `Evidence` を import なしで使える

## 確かめる

1. hook の検査出力が返ってきたら直す（手で回すなら `bun run lint:content`）
2. `bun run check`
3. `bun run dev` で該当ページを開き、駅のラベルが2行に収まっているか、線ラベルが駅に隠れていないか、線が札を突き抜けていないかを見る。崩れたら `at` を動かす
