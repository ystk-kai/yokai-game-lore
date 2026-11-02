@AGENTS.md

## Claude Code 固有

- 共通規約は上の AGENTS.md が正本。規約を変えるときは AGENTS.md を直し、このファイルには Claude Code だけに関係することを書く
- `src/content/games/` と `public/games/` を編集すると、PostToolUse hook（`.claude/hooks/check-content.sh`）がそのゲームのコンテンツ検査を走らせる。失敗の出力が返ってきたら、その場で直してから次へ進む
- 作業の入口になる skill:
  - `add-game` — 新しいゲームを足す（権利の調査 → game.yaml → 本編の流れ図 → 人物）
  - `lore-page` — 既存のゲームに図やページを足す・直す
- ゲームの物語や権利の調査は、`imozuru` スキル（使えるとき）で原文を `~/research/<話題>/` に保存してから書く。調べた内容の出典は、ページの `sources` とリンクに残す。調査を終えたら `research/topics.txt` に話題を足し、`bun run research:export` で `research/` に書き出してコミットする（原文は入れない）
- 見た目を変えるときは DESIGN.md を先に読む。日本語の書体・図のラベルの判断は `ui-design` スキルの日本語組版・日本語図解の資料に従う
