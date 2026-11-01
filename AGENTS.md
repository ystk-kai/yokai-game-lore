# AGENTS.md

Yokai Game Lore は、ゲームの物語と考察を図解（路線図・相関図・年表）で整理する、非公式のファンサイト。Astro の静的サイトで、GitHub Pages に公開する（リポジトリは public）。Claude Code と Codex の共通規約はこのファイルが正本で、`CLAUDE.md` は `@AGENTS.md` で読み込む。見た目の規約は [DESIGN.md](DESIGN.md) にある。

## 応答と文章

- ユーザーへの応答は日本語
- サイトの文章は「です・ます」で書く。誰が何をしたかが分かる文にし、作中の描写と推測を混ぜない（下の「考察の書き方」）
- コミットは Conventional Commits。`type(scope)` は英語、件名と本文は日本語。scope は `content` `diagram` `ui` `harness` `ci` やゲームの id（例 `feat(reanimal): DLC 第2章の流れを追加`）

## コマンド

Bun（1.4 系）を使う。npm・pnpm・yarn は使わない。

| やること | コマンド |
|---|---|
| 依存を入れる | `bun install` |
| 開発サーバー（http://localhost:4321/yokai-game-lore/） | `bun run dev` |
| コンテンツの検査だけ（速い） | `bun run lint:content` |
| 完了前の検証（コンテンツ検査 → 型検査 → ビルド） | `bun run check` |

## 構成

```
src/content/games/<game>/
  game.yaml          ゲームの基本情報と権利の扱い（rights）
  assets.yaml        掲載する画像の登録（公式素材は rights が許すときだけ）
  characters.yaml    人物・怪物の名鑑
  diagrams/*.yaml    図のデータ（type: flow / relations / timeline / order）
  pages/*.mdx        ページ本文。<Diagram id="<game>/<図の名前>" /> で図を置く
public/games/<game>/ assets.yaml に登録した画像の実体
src/schema.ts        データの形（Astro の検査と scripts/check-content.ts の両方が使う）
src/components/      図と部品。MDX では Diagram / Characters / Spoiler / Theory / Icon / Evidence を import なしで使える
refs/                手元だけの参照資料（集めた画像・メモ）。.gitignore 済みで公開しない
```

## 守ること

### 権利（public リポジトリなので最優先）

- ゲームの画像・ロゴ・スクリーンショットは、そのゲームの権利者の規約が**ファンサイトでの掲載を認めている**ときだけ載せる。認めているかは、規約の条文を `game.yaml` の `rights.guideline_quote` にそのまま写して判断の根拠を残す。動画だけを対象にした規約は根拠にならない
- 規約が見つからない・掲載を認めていないゲームは `rights.official_assets: false` にし、汎用アイコン（game-icons.net など）と文章で描く。`scripts/check-content.ts` が、`official_assets: false` のゲームの公式素材を落とす
- 攻略サイト・wiki・動画から集めた画像は `refs/<game>/` にだけ置き、取得元を `refs/<game>/images/SOURCES.tsv` に書く。`public/` や `src/` に写さない
- 各ゲームのページに、権利者の表記と「非公式で、権利者の承認を受けていない」旨を出す（`rights.notice`。ページの下に自動で出る）
- 出典のある文章を長く引き写さない。要点を自分の言葉で書き、出典にリンクする

### 考察の書き方

- 図の駅・人物・出来事・関係には `evidence` を付ける: `official`（公式の資料・発表）/ `ingame`（作中の描写・テキスト）/ `speculation`（推測）。迷ったら弱いほうにする
- 推測には、誰の推測かを書く（`<Theory who="...">`、または本文で出典を示す）
- 事実の文には出典（`sources`、または本文のリンク）を付ける。攻略サイトの記述を作中の描写として使うときは、攻略サイトを出典にする
- 出典どうしが食い違うときは、どちらかを選ばずに両方を書く（図では推測の破線を2本引く）
- 固有名が作中に出ない人物は、通称であることを書く

### ネタバレ

- ページの題名（`title`）と説明（`description`）にネタバレを入れない。一覧やリンク先の表示に出るため
- ページごとに `spoiler_scope`（どこまで遊んだ人向けか）を書く
- 重要な展開・正体・結末は `<Spoiler scope="…">` か、図の `spoiler:` で覆う。scope には範囲（「第6章の終盤」）を書く

### 図

- 新しい図はまず4種類（flow / relations / timeline / order）で描けないか考える。部品を足すときは DESIGN.md の文法に合わせ、凡例と「文章で読む」一覧を付ける
- 色・書体・余白は `src/styles/tokens.css` のトークンだけを使う。部品の中に色を直書きしない

### 依存とサーバー

- Web サーバーのフレームワーク（Hono・Express など）は入れない。サイトは静的に出力する
- 新しい依存は、保守状況とライセンスを確かめてから入れ、コミットの本文に理由を書く

## 完了前の検証

- どの変更でも `bun run check` が通ること
- コンテンツを変えたら、`bun run dev` で該当ページを開き、図が崩れていないか（ラベルのはみ出し・重なり・覆いの位置）を確かめる。Claude Code では `.claude/hooks/check-content.sh` がコンテンツの編集ごとに検査を走らせる
- 権利に関わる変更（`assets.yaml`・`rights`・`public/games/`）は、作業報告で根拠の条文を示す
