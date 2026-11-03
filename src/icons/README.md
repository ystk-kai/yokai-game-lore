# このサイトで作ったアイコン（`site:`）

ゲームの人物をかたどった単色のアイコン。`site.json` は iconify 形式（512×512、`fill="currentColor"`）で、`gi:`・`lucide:` と同じく `src/lib/icons.ts` が SVG に展開する。図の中ではレーンの色で塗られる。

| 名前 | 何をかたどったか | 使う所 |
|---|---|---|
| `reanimal-girl` | REANIMAL の少女（ウサギの仮面。目の穴は向かって右の1つだけで丸。長い黒髪） | ゲームのアイコン・少女 |
| `splatoon-squid` | スプラトゥーンのイカの姿（大きな丸い目） | ゲームのアイコン・ヒーローモード |
| `little-nightmares-six` | リトルナイトメアのシックスの上半身（とがったフードのレインコートとライター） | ゲームのアイコン・シックス |

## 作り方

1. Codex の画像生成（gpt-image）で、白地に黒1色のシルエットを 1024px で作る。game-icons.net と同じ塗りの絵柄にし、細い線や小さい飾りを入れない（16px で読めること）。人物の見た目は `public/games/<game>/characters/` の画像を参照として渡す
2. ImageMagick で白黒に2値化し、余白を詰めて正方形の 512px にする
3. vtracer（MIT）の `colormode='binary'` で SVG に変換し、各 path を `fill="currentColor"` にして `site.json` に入れる（vtracer はプロジェクトの依存に入れず、手元の一時 venv で使う）
4. `bun run check` を通し、16px・32px・大きいサイズで形が崩れていないか見る

人物の意匠の権利は各ゲームの権利者にある。権利者から求められたら、`gi:` の汎用アイコンに戻す。
