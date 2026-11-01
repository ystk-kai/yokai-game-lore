# AGENTS.md

Yokai Game Lore は、ゲームの物語と考察を図解（流れ図・相関図・年表）で整理する、非公式のファンサイト。Astro の静的サイトで、GitHub Pages に公開する（リポジトリは public）。Claude Code と Codex の共通規約はこのファイルが正本で、`CLAUDE.md` は `@AGENTS.md` で読み込む。見た目の規約は [DESIGN.md](DESIGN.md) にある。

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
  game.yaml          ゲームの基本情報、作品の一覧（titles。シリーズや DLC を1つのゲームで扱う）、権利の扱い（rights）
  assets.yaml        掲載する画像の登録。kind（screenshot / official-art / render / logo / original）と出典を書く
  characters.yaml    人物・怪物の名鑑
  diagrams/*.yaml    図のデータ（type: flow / relations / timeline / order / schedule）
  pages/*.mdx        ページ本文。section（story / characters / theory）でサイドメニューの区分を決める。<Diagram id="<game>/<図の名前>" /> で図を置く
public/games/<game>/ assets.yaml に登録した画像の実体
src/schema.ts        データの形（Astro の検査と scripts/check-content.ts の両方が使う）
src/components/      図と部品。MDX では Diagram / Characters / Appearances / Theory / Icon / Evidence / Legend を import なしで使える
refs/                手元だけの参照資料（集めた画像・メモ）。.gitignore 済みで公開しない
```

## 守ること

### 権利（public リポジトリなので最優先）

- ゲームの画像・スクリーンショットを載せるかはゲームごとに `game.yaml` の `rights.official_assets` で決め、根拠を `rights.official_assets_note` に正直に書く。規約が掲載を認めているならその条文を `rights.guideline_quote` に写す。規約に許可が無いまま載せるときは「運営者の判断」と書き、勝手に許可があるように書かない（REANIMAL はこの扱い。作者の決定 2026-11-02）
- 載せる画像は、キャラクターの見た目など説明に要るものだけ・小さく・出典つきにする。権利者から求められたら速やかに消す（ページの下に削除依頼の窓口が出る）。ロゴは載せない
- 攻略サイト・wiki・動画から集めた画像は、まず `refs/<game>/`（git 管理外）に置き、取得元を `refs/<game>/images/SOURCES.tsv` に書く。サイトに出すものだけを `public/games/<game>/` に写し、`assets.yaml` に出典（`source_url`・`credit`）つきで登録する。枠や透かしなど取得元サイトの装飾は切り落とす
- 各ゲームのページに、権利者の表記と「非公式で、権利者の承認を受けていない」旨を出す（`rights.notice`。ページの下に自動で出る）
- 出典のある文章を長く引き写さない。要点を自分の言葉で書き、出典にリンクする

### 考察の書き方

- 物語の本筋（本編・DLC のあらすじ、`section: story`）と考察（`section: theory`）は別のページに分ける（作者の決定）。本筋のページには、解釈や推測の図・文を置かない

- 図の場面・人物・出来事・関係には `evidence` を付ける: `official`（公式の資料・発表）/ `ingame`（作中の描写・テキスト）/ `speculation`（推測）。迷ったら弱いほうにする
- 推測には、誰の推測かを書く（`<Theory who="...">`、または本文で出典を示す）
- 事実の文には出典（`sources`、または本文のリンク）を付ける。攻略サイトの記述を作中の描写として使うときは、攻略サイトを出典にする
- 出典どうしが食い違うときは、どちらかを選ばずに両方を書く（図では推測の破線を2本引く）
- 固有名が作中に出ない人物は、通称であることを書く

### ネタバレ

- ネタバレは隠さない。結末・正体・展開もそのまま書き、図にも描く（作者の決定。解説サイトなので伏せる必要がない）。覆い・範囲表示の仕組みは作らない

### 図

- 新しい図はまず5種類（flow / relations / timeline / order / schedule）と、人物の登場作品の表（Appearances）で描けないか考える。部品を足すときは DESIGN.md の文法に合わせ、凡例と「文章で読む」一覧を付ける
- 色・書体・余白は `src/styles/tokens.css` のトークンだけを使う。部品の中に色を直書きしない

### 依存とサーバー

- Web サーバーのフレームワーク（Hono・Express など）は入れない。サイトは静的に出力する
- 新しい依存は、保守状況とライセンスを確かめてから入れ、コミットの本文に理由を書く

## 完了前の検証

- どの変更でも `bun run check` が通ること
- コンテンツを変えたら、`bun run dev` で該当ページを開き、図が崩れていないか（ラベルのはみ出し・重なり）を確かめる。Claude Code では `.claude/hooks/check-content.sh` がコンテンツの編集ごとに検査を走らせる
- 権利に関わる変更（`assets.yaml`・`rights`・`public/games/`）は、作業報告で根拠の条文を示す
