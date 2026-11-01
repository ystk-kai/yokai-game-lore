// アイコンはビルド時に SVG 文字列へ展開する（実行時の読み込みなし）
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils';
import gameIcons from '@iconify-json/game-icons/icons.json' with { type: 'json' };
import lucide from '@iconify-json/lucide/icons.json' with { type: 'json' };
import type { IconifyJSON } from '@iconify/types';

const sets: Record<string, IconifyJSON> = { gi: gameIcons as IconifyJSON, lucide: lucide as IconifyJSON };

export const ICON_SETS = {
  gi: { name: 'game-icons.net', license: 'CC BY 3.0', url: 'https://game-icons.net/', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' },
  lucide: { name: 'Lucide', license: 'ISC', url: 'https://lucide.dev/', licenseUrl: 'https://lucide.dev/license' },
} as const;

export function hasIcon(ref: string): boolean {
  const [set, name] = ref.split(':');
  const data = sets[set];
  return !!data && !!getIconData(data, name);
}

/** "gi:name" / "lucide:name" を <svg> 文字列にする。asset: はここでは扱わない */
export function iconSvg(ref: string, size = '1em'): string {
  const [set, name] = ref.split(':');
  const data = sets[set] && getIconData(sets[set], name);
  if (!data) throw new Error(`アイコンが見つからない: ${ref}`);
  const svg = iconToSVG(data, { height: size });
  return iconToHTML(replaceIDs(svg.body), { ...svg.attributes, 'aria-hidden': 'true', focusable: 'false' });
}
