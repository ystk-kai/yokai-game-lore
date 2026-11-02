# ゲーム考察の図解サイト

> 手元の調査（`~/research/game-lore-diagram-sites/`）から `bun run research:export` で書き出したもの。原文（`sources/`）は他人の記事の写しなので、このリポジトリには入れていない。出典は下の一覧の URL から読める。

- 問い: ゲームの考察（ストーリー・設定・時系列・人物関係）を図解で分かりやすく見せるサイトを、複数ゲーム対応の公開リポジトリとして作るには。既存の考察図解の型、物語の流れ・分岐・時系列の可視化手法の原典、公式アイコン・画像をファンサイトで使う規約、汎用アイコンセットのライセンス、ネタバレの扱い。
- 原文の取得日: 2026-11-01 〜 2026-11-01
- 原文の数: 32（取得できなかったもの 11）

最初の検索語: game lore timeline infographic / storyline visualization narrative chart / fan content policy official assets / ゲーム 考察 図解 時系列 相関図 / ファンサイト 公式素材 ガイドライン

## 調査の論点
- [x] C1 この分野の知見はどこに集まっているか（媒体：考察ブログ・wiki・動画・可視化の研究） — sources/dibartolomeo-2026-storyline-survey.txt:3「EUROVIS 2026」,:409「Graph Drawing」/ sources/einformatica-2023-game-scenario-representation.txt:26「Diagrams are the most common」
- [x] C2 ゲーム考察を図解で見せる既存のサイト・図の型（年表・相関図・物語フロー・分岐図）は何があり、どこで読みにくくなるか — sources/gamepedia-zelda-jikeiretsu.md:175「3つに分岐」/ sources/pcgamesn-elden-ring-family-tree.md:5「family tree」/ sources/dibartolomeo-2026-storyline-survey.txt:93「minimizing line crossings」/ sources/kim-2017-story-curves.txt:42「out of chronological order」
- [x] C3 物語の流れ・分岐・時系列を図にする手法の元になった原典・研究はあるか（storyline visualization など） — sources/xkcd-2009-657-movie-narrative-charts.md:27 / sources/segel-heer-2010-narrative-visualization.txt:380「martini glass」/ sources/kim-2017-story-curves.txt:39「nonlinearity index」/ sources/liu-2013-storyflow.md
- [x] C4 ゲーム会社の公式アイコン・画像をファンサイト（公開 GitHub リポジトリ）で使うとき、どこまで許され、どこで規約違反になるか — 一部のみ。sources/nintendo-guideline-ja.md:10「営利を目的としない場合に限り」/ sources/microsoft-game-content-usage-rules.md:154,198「logos」/ sources/riot-legal-jibber-jabber.md:51,59 / sources/supercell-fan-content-policy-ja.md:31,61 / sources/fromsoftware-guidelines-video-ja.md:71。Capcom 原文は 403
- [x] C5 汎用アイコンセット（ゲーム向け含む）のライセンス条件と、公開リポジトリでの帰属表記で何が足りなくなりやすいか — sources/game-icons-about.md:7「credit the original author」/ sources/lucide-license.md:9 / sources/tabler-icons-license.md:1 / sources/material-symbols-license.md:2 / sources/iconify-icon-sets-licenses.md:29
- [x] C6 考察サイトでのネタバレの扱い方と、その失敗例 — sources/zelda-universe-spoiler-policy.md:45,49 / sources/megido72-netabare-guideline.md:65,83 / sources/halopedia-spoiler-policy.md:51

## 用語
- storyline visualization（ストーリーライン可視化・人物を線、出会いを線の束で描く）— sources/dibartolomeo-2026-storyline-survey.txt
- movie narrative chart（xkcd 657）— sources/xkcd-2009-657-movie-narrative-charts.md
- narrative visualization / martini glass structure / author-driven・reader-driven — sources/segel-heer-2010-narrative-visualization.txt
- story curve / nonlinearity index（語りの順と物語の順のずれ）— sources/kim-2017-story-curves.txt
- line crossings・wiggles（交差・うねり）— sources/dibartolomeo-2026-storyline-survey.txt:93
- Game Content Usage Rules（Microsoft）/ Legal Jibber Jabber（Riot）/ ファンコンテンツポリシー（Supercell）
- Spoiler-Free Period（ネタバレ禁止期間）— sources/zelda-universe-spoiler-policy.md
- 折り畳み・ネタバレ解禁ページ・ラベル（範囲の明示）— sources/megido72-netabare-guideline.md

## 人
- Edward Segel, Jeffrey Heer（UW IDL）— Narrative Visualization 2010
- Yuzuru Tanahashi, Kwan-Liu Ma（UC Davis）— Design Considerations for Optimizing Storyline Visualizations 2012（本文未取得）
- Shixia Liu ら（清華大・MSRA）— StoryFlow 2013
- Nam Wook Kim, Benjamin Bach, Hanspeter Pfister ら — Story Curves 2017
- Sara Di Bartolomeo, Velitchko Filipov, Martin Nöllenburg ら（TU Wien）— storyline 可視化の survey 2026
- Matthew Brehmer, Bongshin Lee, Benjamin Bach ら — Timelines Revisited 2016（未取得）
- Randall Munroe — xkcd 657

## 媒体
- IEEE VIS（InfoVis）・EuroVis / Computer Graphics Forum・Graph Drawing — 可視化の研究
- e-Informatica Software Engineering Journal — ゲームシナリオ表現のマッピング研究
- 各社のガイドラインページ（nintendo.co.jp/networkservice_guideline、xbox.com/developers/rules、riotgames.com/legal、supercell.com/fan-content-policy、fromsoftware.jp/jp/guidelines_video.html、capcom-games.com/en/fan-content-guidelines）
- 考察サイト・wiki（gamepedia.jp 考察大百科、wikiwiki.jp、Fandom、Zelda Universe、Halopedia）
- アイコン（game-icons.net、lucide.dev、tabler.io、Material Symbols、Iconify）


## 次の手がかり
- Capcom fan content guidelines 原文 — 403。ユーザーのブラウザで開けば読める
- Brehmer ら 2016 Timelines Revisited — 時系列図の 14 の設計選択。aviz.fr がタイムアウト
- Tanahashi & Ma 2012 本文 — storyline の設計目標の原典
- HoYoverse・Square Enix・Bandai Namco・SEGA の規約 — サイトに載せるゲームが決まったら、そのゲームの会社だけ当たる
- 著作権法32条（引用）— 公式画像を引用として載せる場合の根拠

## 出典の一覧

調査の論点に書いた「ファイル名:行」は、この一覧のファイル名を指す（行番号は手元の写しのもの）。

| ファイル名 | 元の URL | 取得日 |
|---|---|---|
| capcom-automaton-2025-fan-guideline | <https://automaton-media.com/en/news/capcom-publishes-fan-content-guidelines-including-rules-against-offensive-fanart-and-commercial-use/> | 2026-11-01 |
| dibartolomeo-2026-storyline-survey | <https://www.cg.tuwien.ac.at/research/publications/2026/di_bartolomeo-2026-tss/di_bartolomeo-2026-tss-paper.pdf> |  |
| dibartolomeo-2026-storyline-survey | <https://www.cg.tuwien.ac.at/research/publications/2026/di_bartolomeo-2026-tss/di_bartolomeo-2026-tss-paper.pdf> | 2026-11-01 |
| einformatica-2023-game-scenario-representation | <https://www.e-informatyka.pl/EISEJ/papers/2023/1/3/eInformatica2023Art03.pdf> |  |
| einformatica-2023-game-scenario-representation | <https://www.e-informatyka.pl/EISEJ/papers/2023/1/3/eInformatica2023Art03.pdf> | 2026-11-01 |
| fromsoftware-automaton-2022-guideline | <https://automaton-media.com/en/news/20220221-9875/> | 2026-11-01 |
| fromsoftware-guidelines-video-ja | <https://www.fromsoftware.jp/jp/guidelines_video.html> | 2026-11-01 |
| game-icons-about | <https://game-icons.net/about.html> | 2026-11-01 |
| gamepedia-zelda-jikeiretsu | <https://gamepedia.jp/story/archives/27> | 2026-11-01 |
| halopedia-spoiler-policy | <https://www.halopedia.org/Halopedia:Spoiler_and_leak_policy> | 2026-11-01 |
| iconify-icon-sets-licenses | <https://iconify.design/docs/icons/all.html> | 2026-11-01 |
| kim-2017-story-curves | <https://www.pure.ed.ac.uk/ws/portalfiles/portal/45220909/2018_StoryCurve_InfoVis.pdf> |  |
| kim-2017-story-curves | <https://www.pure.ed.ac.uk/ws/portalfiles/portal/45220909/2018_StoryCurve_InfoVis.pdf> | 2026-11-01 |
| liu-2013-storyflow | <https://shixialiu.com/publications/storyflow/index.html> | 2026-11-01 |
| lucide-license | <https://lucide.dev/license> | 2026-11-01 |
| material-symbols-license | <https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE> | 2026-11-01 |
| megido72-netabare-guideline | <https://wikiwiki.jp/megido72/%E3%83%8D%E3%82%BF%E3%83%90%E3%83%AC%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E3%82%AC%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3> | 2026-11-01 |
| microsoft-game-content-usage-rules | <https://www.xbox.com/en-US/developers/rules> | 2026-11-01 |
| nintendo-guideline-ja | <https://www.nintendo.co.jp/networkservice_guideline/ja/index.html> | 2026-11-01 |
| paschali-2018-scenario-flow-charts | <https://www.scitepress.org/Papers/2018/66814/66814.pdf> |  |
| paschali-2018-scenario-flow-charts | <https://www.scitepress.org/Papers/2018/66814/66814.pdf> | 2026-11-01 |
| pcgamesn-elden-ring-family-tree | <https://www.pcgamesn.com/elden-ring/family-tree> | 2026-11-01 |
| riot-legal-jibber-jabber | <https://www.riotgames.com/en/legal> | 2026-11-01 |
| segel-heer-2010-narrative-visualization | <https://homes.cs.washington.edu/~jheer/files/narrative.pdf> |  |
| segel-heer-2010-narrative-visualization | <https://homes.cs.washington.edu/~jheer/files/narrative.pdf> | 2026-11-01 |
| supercell-fan-content-policy-ja | <https://supercell.com/en/fan-content-policy/jp/> | 2026-11-01 |
| tabler-icons-license | <https://raw.githubusercontent.com/tabler/tabler-icons/main/LICENSE> | 2026-11-01 |
| tang-2020-plotthread | <https://arxiv.org/pdf/2009.00249> |  |
| tang-2020-plotthread | <https://arxiv.org/pdf/2009.00249> | 2026-11-01 |
| wikipedia-non-free-content | <https://en.wikipedia.org/wiki/Wikipedia:Non-free_content> | 2026-11-01 |
| xkcd-2009-657-movie-narrative-charts | <https://xkcd.com/657/> | 2026-11-01 |
| zelda-universe-spoiler-policy | <https://zeldauniverse.net/spoiler-policy/> | 2026-11-01 |

## 取得できなかったもの

- <https://homes.cs.washington.edu/~jheer/files/narrative.pdf> — 本文が短すぎる（0文字）。pdftotext・pdftoppm・tesseract が無い
- <https://www.cg.tuwien.ac.at/research/publications/2026/di_bartolomeo-2026-tss/di_bartolomeo-2026-tss-paper.pdf> — 本文が短すぎる（0文字）。pdftotext・pdftoppm・tesseract が無い
- <https://www.e-informatyka.pl/EISEJ/papers/2023/1/3/eInformatica2023Art03.pdf> — 本文が短すぎる（0文字）。pdftotext・pdftoppm・tesseract が無い
- <https://www.scitepress.org/Papers/2018/66814/66814.pdf> — 本文が短すぎる（0文字）。pdftotext・pdftoppm・tesseract が無い
- <https://laws.e-gov.go.jp/law/345AC0000000048> — 本文が短すぎる（11文字）
- <https://zeldawiki.wiki/wiki/History_of_the_Zelda_timeline> — HTTPError: HTTP Error 403: Forbidden
- <https://www.mattbrehmer.ca/pdf/timelinesRevisited.pdf> — HTTPError: HTTP Error 404: Not Found
- <https://www.namwkim.org/files/storycurves.pdf> — HTTPError: HTTP Error 404: Not Found
- <https://aviz.fr/~bbach/timelines/Brehmer2016timelines.pdf> — URLError: <urlopen error timed out>
- <https://www.capcom-games.com/en/fan-content-guidelines/> — HTTPError: HTTP Error 403: Forbidden
- <https://www.bunka.go.jp/seisaku/chosakuken/seidokaisetsu/gaiyo/chosakubutsu_jiyu.html> — HTTPError: HTTP Error 404: Not Found

## 経過

### 0周目（2026-11-01）
- 依頼: 「ゲームの考察を図解で分かりやすくまとめたサイト」を複数ゲーム対応・GitHub public（yokai-game-lore）で作る前の調査。調査→構築の順でと指示あり
- 検索役を2本: A=英語、B=日本語（同じ問い・違う探し方）
- 戻り: JA は21検索語・116件、EN は30検索語・440件（digest.py add で queries.jsonl へ）。媒体の内訳: 研究は IEEE VIS・EuroVis（EN のみ）、規約は各社公式とゲーム報道（Automaton・ファミ通等）、考察の実例は攻略・考察サイト（gamepedia.jp・altema・game8）と Fandom、ネタバレ規約は wiki とファンサイト
- 両方に出たもの: 任天堂ガイドライン、game-icons.net、Material Symbols、Capcom 報道、e-Informatica 2023、Zelda 時系列。0周目なので飽和は数えない

### 1周目（2026-11-01）
- 検索役の挙げた中から論点ごとに保存。fetch.py OK 22、FAIL: PDF 4本（pdftotext 無し → uv run --with pdfminer.six で取り直して OK）、egov 著作権法（本文11字・JS 描画）、zeldawiki（403）、Capcom 原文（403。agent-browser 未導入で取り直せず）、bunka.go.jp（404）、Brehmer 2016（mattbrehmer.ca 404 → aviz.fr タイムアウト）
- たどった: 前へ＝chain.py cites W2007546607（Tanahashi & Ma 2012、被引用180）→ Story Curves 2017・PlotThread 2020・Timelines Revisited 2016 を拾う。後ろへ＝Automaton の FromSoftware 記事のリンクから公式ガイドラインを保存。親の検索2本（Story Curves・Timelines Revisited の PDF 探し）
- 区切った理由: 調査の論点の全部に原文の場所が付いた（C4 は一部のみ：Capcom 原文が 403、HoYoverse 等は未着手。対象ゲームが未定なので、ゲームを足すときに当たる）
- 検索役2本はどちらも戻って終了。裏で動いている処理なし

