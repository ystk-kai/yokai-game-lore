#!/usr/bin/env bash
# PostToolUse(Edit|Write): src/content と public/games を書き換えたら、そのゲームだけ検査する。
# 失敗したら exit 2 で stderr を Claude に返し、その場で直させる（規約を CLAUDE.md に書くより確実なため）
set -euo pipefail
file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  */src/content/games/*|*/public/games/*) ;;
  *) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR"
if ! out=$(bun scripts/check-content.ts "$file" 2>&1); then
  echo "$out" >&2
  exit 2
fi
