# Yokai Game Lore

ゲームの物語と考察を、**路線図・相関図・年表**で整理する非公式のファンサイトです。

- サイト: https://ystk-kai.github.io/yokai-game-lore/
- 収録: [REANIMAL](https://ystk-kai.github.io/yokai-game-lore/games/reanimal/)（本編の流れ・登場人物・DLC・結末の考察）

## 図の考え方

```
 ●──────○──────○──────○      章を「駅」、話の進む向きを「路線」で描く
                       │      線の色＝舞台や系統
 ○──────○╌╌╌╌╌○──────○      破線＝推測（根拠の強さを線の種類で描き分ける）
```

どのゲームも、最初のページは本編の路線図です。作中の描写（作中）・公式の資料（公式）・ファンの推測（推測）を、どの図でも同じ印で区別します。読み方は [図の読み方](https://ystk-kai.github.io/yokai-game-lore/guide/) にあります。

## 開発

[Bun](https://bun.sh/) と [Astro](https://astro.build/) で作った静的サイトです。

```sh
bun install
bun run dev     # http://localhost:4321/yokai-game-lore/
bun run check   # コンテンツ検査 → 型検査 → ビルド
```

ゲームの追加やページの書き方は [AGENTS.md](AGENTS.md)、見た目の規約は [DESIGN.md](DESIGN.md) にあります。

## 権利

- このサイトは非公式のファンサイトで、各ゲームの権利者の運営・承認・後援を受けていません。ゲームの名称・内容の権利は各権利者に帰属します
- 公式画像は、権利者の規約がファンサイトでの掲載を認めているゲームでのみ使います。REANIMAL は該当する規約が見つからないため、公式画像を載せていません
- アイコン: [game-icons.net](https://game-icons.net/)（CC BY 3.0、Lorc・Delapouite ほか）、[Lucide](https://lucide.dev/)（ISC）。一覧はサイトの[クレジット](https://ystk-kai.github.io/yokai-game-lore/credits/)にあります
- このリポジトリのコードは MIT License、サイトの文章（考察本文）は CC BY 4.0 です
